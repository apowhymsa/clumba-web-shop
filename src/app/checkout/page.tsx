"use client";

import {
  BaseSyntheticEvent,
  SyntheticEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "@/utils/store/hooks";
import { useForm, useWatch } from "react-hook-form";
import CartItem from "@/components/Cart/CartItem/CartItem";
import { doc, getDoc } from "@firebase/firestore";
import { auth, db } from "@/utils/firebase/firebase";
import { setCart } from "@/utils/store/cartSlice";
import { onAuthStateChanged } from "@firebase/auth";
import axios from "axios";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import Loader from "@/components/Loader/Loader";
import { AuthContext } from "@/contexts/AuthContext/AuthContext";
import useToast from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import CustomDateTimePicker from "@/components/CustomDateTimePicker/CustomDateTimePicker";
import { Dayjs } from "dayjs";

interface IPaymentData {
  name: string;
  phone: string;
  shippingAddress: string;
  bonuses: number;
  comment: string;
}

const Checkout = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_API_KEY!,
    libraries: ["places", "geocoding"],
  });
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(null);
  const [deliveryAmount, setDeliveryAmount] = useState(0);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [isLoading, setloading] = useState(true);
  const [isCompleteRequest, setCompleteRequest] = useState(true);
  const cart = useAppSelector((state) => state.cartReducer).cart;
  const cartPrice = useAppSelector((state) => state.cartReducer).cartPrice;
  const [user, setUser] = useState<any>();
  const dispatch = useAppDispatch();
  const [searchResult, setSearchResult] = useState<any>(null);
  const autocompleteRef = useRef();
  const { isLogged, isLoading: isLoadingAuth } = useContext(AuthContext);
  const { error, info } = useToast();
  const router = useRouter();
  const [deliveryType, setDeliveryType] = useState(1);
  const [deliveryTime, setDeliveryTime] = useState(1);
  const [openPayment, setOpenPayment] = useState<string>("");
  const [isCartDiscount, setCartDiscount] = useState(false);
  const [bonuses, setBonuses] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<IPaymentData>();

  useEffect(() => {
    const bool = cart.find(
      (cartItem) => cartItem.variant.discount.state === true
    );
    if (bool) {
      setCartDiscount(true);
    } else {
      setCartDiscount(false);
    }
  }, []);

  useEffect(() => {
    if (openPayment.trim().length > 0) {
      // window.open(openPayment, "_self");
      location.href = openPayment;
      setOpenPayment("");
    }
  }, [openPayment]);

  const getDeliveryPrice = async () => {
    try {
      const response = await fetch(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/deliveryPrice`,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            "Access-Control-Allow-Origin": "*",
            credentials: "include",
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      console.info("delivery price", data);
      setDeliveryPrice(data[0]?.price || 12);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setloading(true);
    if (!isLoadingAuth) {
      if (!isLogged) {
        info("Для оформлення замовлення потрібно увійти в обліковий запис");
        return router.push("/");
      } else {
        const userAuthId = localStorage.getItem("authUserId");

        if (userAuthId) {
          Promise.all([getDeliveryPrice(), getUserInfo(userAuthId)]).then(() =>
            setloading(false)
          );
        }
      }
    } else {
      setloading(false);
    }
  }, [isLogged, isLoadingAuth]);

  const onLoad = (autocomplete: any) => {
    setSearchResult(autocomplete);
  };

  const getDistance = async (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    return new Promise((resolve) => {
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          destinations: [{ lat: lat2, lng: lng2 }],
          origins: [{ lat: lat1, lng: lng1 }],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response) => {
          resolve(response);
        }
      );
    });
  };
  const onPlaceChanged = async () => {
    if (searchResult != null) {
      //variable to store the result
      const place = searchResult.getPlace();
      //variable to store the name from place details result
      const name = place.name;
      //variable to store the status from place details result
      const status = place.business_status;
      //variable to store the formatted address from place details result
      const formattedAddress = place.formatted_address;
      // console.log(place);
      //console log all results
      console.log(`Name: ${name}`);
      console.log(`Business Status: ${status}`);
      console.log(`Formatted Address: ${formattedAddress}`);
      const results = await getGeocode({ address: formattedAddress });
      const { lat, lng } = await getLatLng(results[0]);

      const shopLat = 47.939615;
      const shopLng = 33.426008;

      // 47.939615 33.426008

      getDistance(shopLat, shopLng, lat, lng).then((response: any) => {
        console.log("res", response);
        const dAmount =
          Math.ceil(response.rows[0].elements[0].distance.value / 1000) *
          Number(deliveryPrice);
        console.log(dAmount);
        setDeliveryAmount(dAmount);
      });

      console.log(lat, lng);
    }
  };

  const submitHandler = (
    data: IPaymentData,
    event: BaseSyntheticEvent<object, any, any> | undefined
  ) => {
    setCompleteRequest(false);
    const cartJoin = cart
      .map(
        (cartItem) =>
          `${cartItem.product.title} - ${cartItem.variant.title} (${cartItem.quantity} ед.)`
      )
      .join(" ");

    const userID = localStorage.getItem("authUserId");

    if (userID) {
      const params = {
        amount:
          deliveryType === 1
            ? cartPrice - bonuses
            : cartPrice - bonuses + deliveryAmount,
        description: `Оплата товаров: ${cartJoin}`,
        additionalData: {
          userID: userID,
          amountWoDeliveryPrice: cartPrice - bonuses,
          bonuses: bonuses,
          deliveryPrice: deliveryAmount,
          phone: data.phone,
          comment: data.comment || "",
          products: cart.map((cartItem) => {
            return {
              product_id: cartItem.product._id,
              productVariant: {
                title: cartItem.variant.title,
                id: cartItem.variant._id,
              },
              count: Number(cartItem.quantity),
            };
          }),
          shippingAddress:
            deliveryType === 1 ? "Самовывоз" : data.shippingAddress,
          deliveryTime:
            deliveryTime === 1
              ? "Довільна дата та час"
              : selectedDateTime?.toDate().toLocaleString(),
          name: data.name,
        },
      };

      console.log(params);

      axios
        .post(
          `${process.env.ADMIN_ENDPOINT_BACKEND}/payment`,
          {
            ...params,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
              "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
          }
        )
        .then((data) => {
          console.log(data.data, data.status);

          if (data.status === 200) {
            setOpenPayment(data.data.paymentURL);
          } else {
            console.error("ERROR", data.data);
          }
        })
        .catch((error) => console.error(error))
        .finally(() => setCompleteRequest(true));
    }
  };

  const getUserInfo = async (userAuthId: string) => {
    const response = await axios.get(
      `${process.env.ADMIN_ENDPOINT_BACKEND}/user/${userAuthId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      }
    );

    setUser(response.data);
  };

  function handleChangeRadio(e: SyntheticEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    setDeliveryType(Number(target.value));
  }

  function handleDeliveryTimeChangeRadio(e: SyntheticEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    setDeliveryTime(Number(target.value));
  }

  if (isLoading || !isLoaded) {
    return <Loader />;
  }

  return (
    <div id="liqpay_checkout" className="shadow mx-24 my-14 p-5">
      {cart.length > 0 ? (
        <>
          <h2 className="text-xl font-bold border-b py-2">
            Оформлення замовлення
          </h2>
          <div className="flex gap-x-14 justify-center pt-6">
            <form
              className="flex-1 flex flex-col gap-y-5"
              onSubmit={handleSubmit(submitHandler)}
            >
              <div>
                <label
                  htmlFor="name"
                  className={`mb-1 block text-sm font-bold text-gray-700 ${
                    errors.name
                      ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                      : null
                  }`}
                >
                  Ім`я та прізвище
                </label>
                <div className="relative">
                  <input
                    defaultValue={user.personals.fullName}
                    className={`block w-full rounded-md shadow-sm ${
                      errors.name
                        ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                        : "border-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-200"
                    }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                    {...register("name", {
                      required: {
                        value: true,
                        message: "Поле обязательное для заполнения",
                      },
                    })}
                    type="text"
                    name="name"
                  />
                </div>
                {errors.name ? (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className={`mb-1 block text-sm font-bold text-gray-700 ${
                    errors.phone
                      ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                      : null
                  }`}
                >
                  Телефон
                </label>
                <div className="relative">
                  <input
                    defaultValue={user.personals.phoneNumber}
                    className={`block w-full rounded-md shadow-sm ${
                      errors.phone
                        ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                        : "border-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-200"
                    }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                    {...register("phone", {
                      required: {
                        value: true,
                        message: "Поле обязательное для заполнения",
                      },
                    })}
                    placeholder="Например: +380686560665"
                    type="tel"
                    name="phone"
                  />
                </div>
                {errors.phone ? (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                ) : null}
              </div>
              {!isCartDiscount && <hr />}
              <div className="text-[14px]">
                {!isCartDiscount && (
                  <div>
                    <label
                      htmlFor="name"
                      className={`mb-1 block text-sm font-bold text-gray-700 ${
                        errors.name
                          ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                          : null
                      }`}
                    >
                      Використати бонуси
                    </label>
                    <div className="relative">
                      <input
                        defaultValue={0}
                        className={`block w-full rounded-md shadow-sm ${
                          errors.bonuses
                            ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                            : "border-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-200"
                        }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                        {...register("bonuses", {
                          required: {
                            value: true,
                            message:
                              "Поле обязательное для заполнения. Укажите 0 если не хотите использовать бонусы",
                          },
                        })}
                        min={0}
                        onChange={(e) => {
                          if (Number(e.target.value) > Number(e.target.max)) {
                            setValue("bonuses", Number(e.target.max));
                          }

                          setBonuses(Number(e.target.value));
                        }}
                        max={
                          user && user.promo.bonuses >= Number(cartPrice) / 2
                            ? Number(cartPrice) / 2
                            : user.promo.bonuses
                        }
                        type="number"
                        name="name"
                      />
                      <p className="text-gray-500">
                        Максимальна кількість: {Number(cartPrice) / 2}. Ваш
                        баланс: {user && user.promo.bonuses}
                      </p>
                    </div>
                    {errors.bonuses ? (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.bonuses.message}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
              <hr />
              <div>
                <div className="flex flex-col gap-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      onChange={handleDeliveryTimeChangeRadio}
                      value="1"
                      type="radio"
                      id="deliverytime1"
                      checked={deliveryTime === 1}
                      name="deliverytime"
                      className="h-4 w-4 rounded-full border-gray-300 text-rose-400 shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400"
                    />
                    <label
                      htmlFor="deliverytime1"
                      className="text-sm font-medium text-gray-700"
                    >
                      Залишити довільну дату та час доставки
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex h-5 items-center">
                      <input
                        onChange={handleDeliveryTimeChangeRadio}
                        value="2"
                        type="radio"
                        id="deliverytime2"
                        checked={deliveryTime === 2}
                        name="deliverytime"
                        className="h-4 w-4 rounded-full border-gray-300 text-rose-400 shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400"
                      />
                    </div>
                    <label htmlFor="deliverytime2" className="text-sm">
                      Вказати конкретну дату та час доставки
                    </label>
                  </div>
                </div>
                {deliveryTime === 2 && (
                  <div className="mt-4">
                    <CustomDateTimePicker
                      selectedDateTime={selectedDateTime}
                      setSelectedDateTime={setSelectedDateTime}
                    />
                  </div>
                )}
              </div>
              <hr />
              <div>
                <div className="flex flex-col gap-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <input
                      onChange={handleChangeRadio}
                      value="1"
                      type="radio"
                      id="delivery1"
                      checked={deliveryType === 1}
                      name="delivery"
                      className="h-4 w-4 rounded-full border-gray-300 text-rose-400 shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400"
                    />
                    <label
                      htmlFor="delivery1"
                      className="text-sm font-medium text-gray-700"
                    >
                      Самовивіз з нашого магазину
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex h-5 items-center">
                      <input
                        onChange={handleChangeRadio}
                        value="2"
                        type="radio"
                        id="delivery2"
                        checked={deliveryType === 2}
                        name="delivery"
                        className="h-4 w-4 rounded-full border-gray-300 text-rose-400 shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400"
                      />
                    </div>
                    <label htmlFor="delivery2" className="text-sm">
                      <div className="font-medium text-gray-700">
                        Доставка за адресою
                      </div>
                      <p className="text-gray-500">
                        Вкажіть коректну адресу, вартість доставки буде
                        розраховуватись на її основі!
                      </p>
                    </label>
                  </div>
                </div>
                {deliveryType === 2 && (
                  <>
                    <label
                      htmlFor="shippingAddress"
                      className={`mb-1 block text-sm font-bold text-gray-700 ${
                        errors.shippingAddress
                          ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                          : null
                      }`}
                    >
                      Адреса доставки
                    </label>
                    <div className="relative">
                      <Autocomplete
                        onPlaceChanged={onPlaceChanged}
                        onLoad={onLoad}
                        options={{
                          componentRestrictions: { country: "ua" },
                        }}
                      >
                        <input
                          className={`block w-full rounded-md shadow-sm ${
                            errors.shippingAddress
                              ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                              : "border-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-200"
                          }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                          {...register("shippingAddress", {
                            required: {
                              value: true,
                              message: "Поле обязательное для заполнения",
                            },
                          })}
                          placeholder="Например: Сичеславская 1/2"
                          type="text"
                          name="shippingAddress"
                        />
                      </Autocomplete>
                    </div>
                    {errors.shippingAddress ? (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.shippingAddress.message}
                      </p>
                    ) : null}
                    {deliveryAmount > 0 && (
                      <span className="block text-[15px] w-full text-right pt-4 underline">
                        Розрахункова вартість доставки:{" "}
                        <span className="font-semibold text-[16px]">
                          {deliveryAmount} ₴ ({deliveryPrice} грн за км.)
                        </span>
                      </span>
                    )}
                  </>
                )}
              </div>
              <hr />
              <div className="w-full">
                <div>
                  <label
                    htmlFor="orderComment"
                    className="mb-1 block text-sm text-gray-700 font-bold"
                  >
                    Додаткова інформація до замовлення
                  </label>
                  <textarea
                    {...register("comment")}
                    id="orderComment"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
                    rows={3}
                    placeholder="Введіть коментарій до замовлення, який буде розглянутий нашим флористом"
                  ></textarea>
                </div>
              </div>
              <button
                disabled={!isCompleteRequest}
                className="border border-rose-400 text-white bg-rose-400 px-4 py-2 rounded transition-colors hover:bg-rose-500"
              >
                {isCompleteRequest ? "Перейти к оплате" : "Обработка..."}
              </button>
            </form>
            <div className="flex-1">
              <h3 className="text-right border-b pb-2">
                <span>
                  Всього до сплати:{" "}
                  <span className="font-bold">
                    {Number(cartPrice) - Number(bonuses)} ₴{" "}
                    {deliveryAmount > 0 && `+ ${deliveryAmount} ₴ доставка`}
                  </span>
                </span>
              </h3>
              <div className="pt-6 flex flex-col gap-y-6">
                {cart.map((cartItem, index) => (
                  <CartItem
                    cartItem={cartItem}
                    quantityItem={cartItem.quantity}
                    key={index}
                    inCheckout={true}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Checkout;

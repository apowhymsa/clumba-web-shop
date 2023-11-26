'use client'

import {BaseSyntheticEvent, SyntheticEvent, useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/utils/store/hooks";
import {useForm} from "react-hook-form";
import CartItem from "@/components/Cart/CartItem/CartItem";
import {doc, getDoc} from "@firebase/firestore";
import {auth, db} from "@/utils/firebase/firebase";
import {setCart} from "@/utils/store/cartSlice";
import {onAuthStateChanged} from "@firebase/auth";
import axios from "axios";
import {Autocomplete, useLoadScript} from "@react-google-maps/api";
import {getGeocode, getLatLng} from "use-places-autocomplete";

interface IPaymentData {
    name: string;
    phone: string;
    shippingAddress: string;
}

const Checkout = () => {
    const {isLoaded} = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_API_KEY!,
        libraries: ['places', 'geocoding']
    });

    const [isLoading, setloading] = useState(true);
    const [isCompleteRequest, setCompleteRequest] = useState(true);
    const cart = useAppSelector(state => state.cartReducer.cart);
    const [user, setUser] = useState<any>();
    const dispatch = useAppDispatch();
    const [searchResult, setSearchResult] = useState<any>(null);
    const autocompleteRef = useRef();
    const [deliveryType, setDeliveryType] = useState(1);
    const [openPayment, setOpenPayment] = useState<string>('');
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<IPaymentData>();

    useEffect(() => {
        if (openPayment.trim().length > 0) {
            // window.open(openPayment, "_self");
            location.href = openPayment;
            setOpenPayment('');
        }
    }, [openPayment]);


    useEffect(() => {
        setloading(true);

        const userAuthId = localStorage.getItem("authUserId");

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                if (userAuthId) {
                    console.log("auth", userAuthId);

                    Promise.all([getUserInfo(userAuthId), getCart(userAuthId)])
                        .then(() => setloading(false));
                }
            } else {
                dispatch(setCart([]));

                setloading(false);
            }
        });
    }, []);

    const onLoad = (autocomplete: any) => {
        setSearchResult(autocomplete);
    }

    // function getDistance(p1lat: number, p2lat: number, p1lng: number, p2lng: number) {
    //     let R = 6378137; // Earth’s mean radius in meter
    //     let dLat = getRad(p2lat - p1lat);
    //     let dLong = getRad(p2lng - p1lng);
    //     let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //         Math.cos(getRad(p1lat)) * Math.cos(getRad(p2lat)) *
    //         Math.sin(dLong / 2) * Math.sin(dLong / 2);
    //     let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //     let d = R * c;
    //     return d; // returns the distance in meter
    // }
    const getDistance = async (lat1: number, lng1: number, lat2: number, lng2: number) => {
        return new Promise((resolve) => {
            const service = new window.google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                {
                    destinations: [{lat: lat2, lng: lng2}],
                    origins: [{lat: lat1, lng: lng1}],
                    travelMode: window.google.maps.TravelMode.DRIVING
                },
                (response) => {
                    resolve(response)
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
            const results = await getGeocode({address: formattedAddress})
            const {lat, lng} = await getLatLng(results[0]);

            const shopLat = 47.939615;
            const shopLng = 33.426008;

            // 47.939615 33.426008

            getDistance(shopLat, shopLng, lat, lng).then(response => console.log('res', response));

            console.log(lat, lng);
        }
    }

    const submitHandler = (data: IPaymentData, event: BaseSyntheticEvent<object, any, any> | undefined) => {
        setCompleteRequest(false);
        const amount = cart.reduce(
            (acc, cartItem) =>
                acc +
                Number(cartItem.product.price["1"].slice(0, -2)) *
                cartItem.quantity,
            0,
        );
        const cartJoin = cart.map(cartItem => `${cartItem.product.product_name} (${cartItem.quantity} ед.)`).join(' ');

        const params = {
            amount: amount,
            description: `Оплата товаров: ${cartJoin}`,
            posterData: {
                phone: data.phone,
                products: cart.map(cartItem => {
                    return {product_id: Number(cartItem.product.product_id), count: Number(cartItem.quantity)};
                }),
                shippingAddress: deliveryType === 1 ? 'Самовывоз' : data.shippingAddress,
                name: data.name
            }
        }

        axios.post('https://poster-shop-server.onrender.com/payment', {
            ...params
        }, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
            .then((data) => {
                console.log(data.data, data.status)

                if (data.status === 200) {
                    setOpenPayment(data.data.paymentURL);
                } else {
                    console.error('ERROR', data.data)
                }
            })
            .catch(error => console.error(error))
            .finally(() => setCompleteRequest(true))
    }

    const getCart = async (userAuthId: string) => {
        const userRef = doc(db, "users", userAuthId!.toString());
        const userSnapshot = await getDoc(userRef);

        dispatch(setCart(userSnapshot.data()?.cart || []));
        // setC(userSnapshot.data()?.cart || []);
    };

    const getUserInfo = async (userAuthId: string) => {
        const userRef = doc(db, "users", userAuthId!.toString());
        const userSnapshot = await getDoc(userRef);

        const name = userSnapshot.data()?.name;
        const phone = userSnapshot.data()?.phone;

        setUser({...user, name, phone});
    }

    function handleChangeRadio(e: SyntheticEvent<HTMLInputElement>) {
        const target = e.target as HTMLInputElement;
        setDeliveryType(Number(target.value))
    }

    if (isLoading || !isLoaded) {
        return <div>Loading...</div>
    }

    return <div id="liqpay_checkout" className="shadow mx-24 my-14 p-5">
        {cart.length > 0 ? (
            <><h2 className="text-xl font-bold border-b py-2">Заказ</h2>
                <div className="flex gap-x-14 justify-center pt-6">
                    <form className="flex-1 flex flex-col gap-y-5" onSubmit={handleSubmit(submitHandler)}>
                        <div>
                            <label
                                htmlFor="name"
                                className={`mb-1 block text-sm font-bold text-gray-700 ${
                                    errors.name ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null
                                }`}
                            >
                                Имя
                            </label>
                            <div className="relative">
                                <input
                                    readOnly={!!user.name}
                                    value={user.name}
                                    className={`block w-full rounded-md shadow-sm ${
                                        errors.name
                                            ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                                            : "border-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-200"
                                    }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                                    {...register("name", {
                                        required: {
                                            value: true,
                                            message: 'Поле обязательное для заполнения'
                                        }
                                    })}
                                    type="text"
                                    name="name"
                                />
                            </div>
                            {errors.name ? (
                                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                            ) : null}
                        </div>
                        <div>
                            <label
                                htmlFor="phone"
                                className={`mb-1 block text-sm font-bold text-gray-700 ${
                                    errors.phone ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null
                                }`}
                            >
                                Телефон
                            </label>
                            <div className="relative">
                                <input
                                    readOnly={!!user.phone}
                                    value={user.phone}
                                    className={`block w-full rounded-md shadow-sm ${
                                        errors.phone
                                            ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                                            : "border-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-200"
                                    }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                                    {...register("phone", {
                                        required: {
                                            value: true,
                                            message: 'Поле обязательное для заполнения'
                                        }
                                    })}
                                    placeholder="Например: +380686560665"
                                    type="tel"
                                    name="phone"
                                />
                            </div>
                            {errors.phone ? (
                                <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                            ) : null}
                        </div>
                        <div>
                            <div className="flex flex-col gap-y-2 mb-4">
                                <div className="flex items-center space-x-2">
                                    <input onChange={handleChangeRadio} value="1" type="radio" id="delivery1" checked={deliveryType === 1} name="delivery" className="h-4 w-4 rounded-full border-gray-300 text-rose-400 shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400" />
                                    <label htmlFor="delivery1" className="text-sm font-medium text-gray-700">Самовывоз из магазина</label>
                                </div>
                                <div className="flex space-x-2">
                                    <div className="flex h-5 items-center">
                                        <input onChange={handleChangeRadio} value="2" type="radio" id="delivery2" checked={deliveryType === 2} name="delivery" className="h-4 w-4 rounded-full border-gray-300 text-rose-400 shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400" />
                                    </div>
                                    <label htmlFor="delivery2" className="text-sm">
                                        <div className="font-medium text-gray-700">Доставка по адресу</div>
                                        <p className="text-gray-500">Укажите корректный адрес, стоимость доставки будет расчитываться на его основе!</p>
                                    </label>
                                </div>
                            </div>
                            {deliveryType === 2 && (
                                <>
                                    <label
                                        htmlFor="shippingAddress"
                                        className={`mb-1 block text-sm font-bold text-gray-700 ${
                                            errors.shippingAddress ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null
                                        }`}
                                    >
                                        Адрес доставки
                                    </label>
                                    <div className="relative">
                                        <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}
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
                                                        message: 'Поле обязательное для заполнения'
                                                    }
                                                })}
                                                placeholder="Например: Сичеславская 1/2"
                                                type="text"
                                                name="shippingAddress"
                                            />
                                        </Autocomplete>
                                    </div>
                                    {errors.shippingAddress ? (
                                        <p className="mt-1 text-sm text-red-500">{errors.shippingAddress.message}</p>
                                    ) : null}
                                </>
                            )}
                        </div>
                        <button
                            disabled={!isCompleteRequest}
                            className="border border-rose-400 text-white bg-rose-400 px-4 py-2 rounded transition-colors hover:bg-rose-500"
                        >
                            {isCompleteRequest ? 'Перейти к оплате' : 'Обработка...'}
                        </button>
                    </form>
                    <div className="flex-1">
                        <h3 className="text-right border-b pb-2">
                            <span>Всего к оплате: &#8372;{" "}</span>
                            {cart.reduce(
                                (acc, cartItem) =>
                                    acc +
                                    Number(cartItem.product.price["1"].slice(0, -2)) *
                                    cartItem.quantity,
                                0,
                            )}
                        </h3>
                        <div className="pt-6 flex flex-col gap-y-6">
                            {cart.map(cartItem => (
                                <CartItem cartItem={cartItem} quantityItem={cartItem.quantity}
                                          key={cartItem.product.product_id} inCheckout={true}/>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <div>Нет доступа</div>
        )}

    </div>
}

export default Checkout;
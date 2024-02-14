import "./CategoriesFilter.scss";
import { Dispatch, SetStateAction } from "react";
import { useAppSelector } from "@/utils/store/hooks";
import RangeSlider from "@/components/UI/RangeSlider/RangeSlider";
import { useTranslation } from "next-i18next";

type Props = {
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  onChangeFilterCategoriesHandler: (
    e: React.SyntheticEvent<HTMLInputElement>
  ) => void;
  onChangeFilterPriceHandler: (
    resultValues: [number, number],
    thumbIndex: number
  ) => void;
  priceSliderDefaultValue: string[] | [number, number];
  categoriesFilter: string[];
};
const CategoriesFilter = (props: Props) => {
  const {
    setVisible,
    isVisible,
    onChangeFilterPriceHandler,
    onChangeFilterCategoriesHandler,
    priceSliderDefaultValue,
    categoriesFilter,
  } = props;
  const { t, i18n } = useTranslation();

  const categories = useAppSelector(
    (state) => state.categoriesReducer
  ).categories;
  return (
    <div
      className={
        isVisible
          ? "categories-filter-container categories-filter-container-active"
          : "categories-filter-container"
      }
    >
      <div className="categories-filter-content">
        <div className="categories">
          <h3 className="font-medium text-gray-900 mb-4">
            {i18n.language === "uk" ? "Категорії" : "Categories"}
          </h3>
          <div className="category-grid grid grid-cols-4 gap-5 gap-y-4">
            {categories.categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center gap-x-2 flex-0 max-w-full break-words"
              >
                <input
                  onChange={onChangeFilterCategoriesHandler}
                  type="checkbox"
                  checked={
                    !!categoriesFilter.find(
                      (value) => value === category._id
                    ) || false
                  }
                  value={category._id}
                  id={category._id}
                  className="h-4 w-4 rounded checked:text-rose-400 shadow-sm text-rose-400 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-offset-0 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:text-gray-400"
                />
                <label htmlFor={category._id} className="text-sm text-gray-700">
                  {category.title}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="prices">
          <h3 className="font-medium text-gray-900 mb-4">
            {i18n.language === "uk" ? "Ціна" : "Price"}
          </h3>
          <div className="slider-container w-[400px]">
            <RangeSlider
              onAfterChange={onChangeFilterPriceHandler}
              defaultValue={priceSliderDefaultValue as [number, number]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesFilter;

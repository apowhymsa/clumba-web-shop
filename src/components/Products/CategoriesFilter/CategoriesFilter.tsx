import "./CategoriesFilter.scss";
import { Dispatch, SetStateAction } from "react";
import { useAppSelector } from "@/utils/store/hooks";
import RangeSlider from "@/components/UI/RangeSlider/RangeSlider";

type Props = {
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  onChangeFilterCategoriesHandler: (
    e: React.SyntheticEvent<HTMLInputElement>,
  ) => void;
  onChangeFilterPriceHandler: (
    resultValues: [number, number],
    thumbIndex: number,
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

  const categories = useAppSelector(
    (state) => state.categoriesReducer,
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
          <h3 className="font-medium text-gray-900 mb-2">Категории</h3>
          <div className="category-grid grid grid-cols-4 gap-5 gap-y-4">
            {categories.map((category, index) => (
                <div
                  key={category.category_id}
                  className="flex items-center gap-x-2 flex-0"
                >
                  <input
                    onChange={onChangeFilterCategoriesHandler}
                    type="checkbox"
                    checked={
                      !!categoriesFilter.find(
                        (value) => value === category.category_id,
                      ) || false
                    }
                    value={category.category_id}
                    id={category.category_id}
                    className="h-4 w-4 rounded checked:text-rose-400 shadow-sm text-rose-400 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-offset-0 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:text-gray-400"
                  />
                  <label
                    htmlFor={category.category_id}
                    className="text-sm text-gray-700"
                  >
                    {category.category_name}
                  </label>
                </div>
            ))}
          </div>
        </div>
        <div className="prices">
          <h3 className="font-medium text-gray-900 mb-2">Цена</h3>
          <div className="slider-container w-[400px]">
            <RangeSlider
              onAfterChange={onChangeFilterPriceHandler}
              defaultValue={priceSliderDefaultValue as [number, number]}
            />
          </div>
        </div>
      </div>
      {/*<span*/}
      {/*  className="categories-filter-close"*/}
      {/*  onClick={() => setVisible(false)}*/}
      {/*>*/}
      {/*  <XMarkIcon className="h-6 w-6 text-gray-400" />*/}
      {/*</span>*/}
    </div>
  );
};

export default CategoriesFilter;

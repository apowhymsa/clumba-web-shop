// export type Product = {
//   barcode: string;
//   category_name: string;
//   color: string;
//   cooking_time: string;
//   cost: string;
//   cost_netto: string;
//   different_spots_prices: string;
//   fiscal: string;
//   fiscal_code: string;
//   hidden: string;
//   ingredient_id: string;
//   ingredients: Ingredients[];
//   master_id: string;
//   menu_category_id: string;
//   nodiscount: string;
//   out: number;
//   photo: string;
//   photo_origin: string;
//   price: {
//     [key: number]: string;
//   };
//   product_code: string;
//   product_id: string;
//   product_name: string;
//   product_production_description: string;
//   product_tax_id: string;
//   profit: {
//     [key: number]: string;
//   };
//   sort_order: string;
//   sources: Source[];
//   spots: Spot[];
//   tax_id: string;
//   type: string;
//   unit: string;
//   weight_flag: string;
//   workshop: string;
// };
//
// type Ingredients = {
//   ingredient_id: string;
//   ingredient_name: string;
//   ingredient_unit: string;
//   ingredient_weight: number;
//   ingredients_losses_bake: string;
//   ingredients_losses_clear: string;
//   ingredients_losses_cook: string;
//   ingredients_losses_fry: string;
//   ingredients_losses_stew: string;
//   pr_in_bake: string;
//   pr_in_clear: string;
//   pr_in_cook: string;
//   pr_in_fry: string;
//   pr_in_stew: string;
//   structure_brutto: number;
//   structure_id: string;
//   structure_lock: string;
//   structure_netto: number;
//   structure_selfprice: string;
//   structure_selfprice_netto: string;
//   structure_type: string;
//   structure_unit: string;
// };
//
// type Modification = {
//   modificator_id: string;
//   modificator_name: string;
//   modificator_selfprice: string;
//   order: string;
//   modificator_barcode: string;
//   modificator_product_code: string;
//   spots: Spot[];
//   sources: Source[];
//   ingredient_id: string;
//   fiscal_code: string;
// };
//
// type Spot = {
//   spot_id: string;
//   price: string;
//   profit: string;
//   profit_netto: string;
//   visible: string;
// };
// type Source = {
//   id: string;
//   name: string;
//   price: string;
//   visible: string;
// };

interface IIngredient {
  id: any;
  variantID: any;
}

export interface IVariantProduct {
  _id?: string;
  title: string;
  price: string;
  discount: {
    state: boolean, percent: string
  };
  ingredients: Array<{
    ingredient: IIngredient; count: string;
  }>;
}

export interface Product {
  _id: string;
  image: string;
  title: string;
  categoryID: any;
  variants: IVariantProduct[];
  isAvailable?: boolean;
}

export type Category = {
  _id: string;
  title: string;
  image: string;
};

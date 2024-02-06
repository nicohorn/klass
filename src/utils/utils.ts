import { ProductType } from "./types";
import { toast } from "react-toastify";

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/**Helper function that retrieves the categories from the items array.
 * As there isn't a collection or table of categories, categories are created once they're added in a product.
 */
export function getCategories(items: ProductType[]): Array<string> {
  const categories = items.map((item) => {
    let categories = item.categories.toString().split("/");
    categories.shift();
    return categories;
  });

  let finalArray = [].concat.apply([], categories);

  //Remove duplicates from the array
  finalArray = finalArray.filter(
    (item, index) => finalArray.indexOf(item) === index
  );

  return finalArray;
}

export function parseLocaleNumber(stringNumber: string, locale: string) {
  var thousandSeparator = Intl.NumberFormat(locale)
    .format(11111)
    .replace(/\p{Number}/gu, "");
  var decimalSeparator = Intl.NumberFormat(locale)
    .format(1.1)
    .replace(/\p{Number}/gu, "");

  return parseFloat(
    stringNumber
      .replace(new RegExp("\\" + thousandSeparator, "g"), "")
      .replace(new RegExp("\\" + decimalSeparator), ".")
  );
}

export const notify = (message) =>
  toast.error(message, {
    autoClose: 8000,
  });

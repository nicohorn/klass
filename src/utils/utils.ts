import { ProductType } from "./types";

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const supabase_images_url =
  "https://wwhqpgatccjocygubiey.supabase.co/storage/v1/object/public/personalized-projects-images/public/";

/**Helper function that retrieves the categories from the items array.
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

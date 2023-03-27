export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
/**Kinda dictionary to map names of colors to their respective image.*/
export const colorsMap = [
  { name: "Enchapado Paraíso", img: "/images/colores_enchapadoparaiso.jpg" },
  { name: "Negro", img: "/images/colores_negro.jpg" },
  { name: "Blanco", img: "/images/colores_blanco.jpg" },
  { name: "Grafito", img: "/images/colores_grafito.jpg" },
  { name: "Himalaya", img: "/images/colores_himalaya.jpg" },
  { name: "Tribal", img: "/images/colores_tribal.jpg" },
  { name: "Safari", img: "/images/colores_safari.jpg" },
  { name: "Tuareg", img: "/images/colores_tuareg.jpg" },
  { name: "Helsinki", img: "/images/colores_helsinki.jpg" },
  { name: "Roble Escandinavo", img: "/images/colores_robleescandinavo.jpg" },
  { name: "Teka Oslo", img: "/images/colores_tekaoslo.jpg" },
  { name: "Seda Giorno", img: "/images/colores_sedagiorno.jpg" },
  { name: "Seda Notte", img: "/images/colores_sedanotte.jpg" },
  { name: "Lino Chiaro", img: "/images/colores_linochiaro.jpg" },
];

export const supabase_images_url =
  "https://wwhqpgatccjocygubiey.supabase.co/storage/v1/object/public/personalized-projects-images/public/";

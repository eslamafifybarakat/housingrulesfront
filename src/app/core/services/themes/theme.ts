export interface Theme {
  name: string;
  properties: any;
}

export const light: Theme = {
  name: "light",
  properties: {
    "--text-main-color": " #006643",
    "--bg-main-color": " #006643",
    "--bg-white-color": "#fff",
  },
};

export const dark: Theme = {
  name: "dark",
  properties: {
    "--text-main-color": " #000",
    "--bg-main-color": " #000",
    "--bg-white-color": "#111",
  }
}

export const patterns = {
  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/,
  userName: /[A-Za-z]/,
  email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  url: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
  // string: "[a-zA-Z||\u0621-\u064A0]+ ",
  phone: /[0-9]{10}/,
  arName: '[\u0621-\u064A00-9 ]+',
  enName: '[a-zA-Z0-9 ]+'
}

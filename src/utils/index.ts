import { message } from "antd";
// @ts-ignore
import { JSEncrypt } from "jsencrypt";
import { ICompanyData, IUsers } from "../api/app/types";

class Utils {
  /**
   * Get first character from first & last sentences of a username
   * @param {String} name - Username
   * @return {String} 2 characters string
   */
  static getNameInitial(name: string) {
    let initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  }

  /**
   * Get current path related object from Navigation Tree
   * @param {Array} navTree - Navigation Tree from directory 'configs/NavigationConfig'
   * @param {String} path - Location path you looking for e.g '/app/dashboards/analytic'
   * @return {Object} object that contained the path string
   */
  static getRouteInfo(navTree: any, path: any): any {
    if (navTree.path === path) {
      return navTree;
    }
    let route;
    for (let p in navTree) {
      if (navTree.hasOwnProperty(p) && typeof navTree[p] === "object") {
        route = this.getRouteInfo(navTree[p], path);
        if (route) {
          return route;
        }
      }
    }
    return route;
  }

  /**
   * Get accessible color contrast
   * @param {String} hex - Hex color code e.g '#3e82f7'
   * @return {String} 'dark' or 'light'
   */
  static getColorContrast(hex: any) {
    const threshold = 130;
    const hRed = hexToR(hex);
    const hGreen = hexToG(hex);
    const hBlue = hexToB(hex);
    function hexToR(h: any) {
      return parseInt(cutHex(h).substring(0, 2), 16);
    }
    function hexToG(h: any) {
      return parseInt(cutHex(h).substring(2, 4), 16);
    }
    function hexToB(h: any) {
      return parseInt(cutHex(h).substring(4, 6), 16);
    }
    function cutHex(h: any) {
      return h.charAt(0) === "#" ? h.substring(1, 7) : h;
    }
    const cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;
    if (cBrightness > threshold) {
      return "dark";
    } else {
      return "light";
    }
  }

  /**
   * Darken or lighten a hex color
   * @param {String} color - Hex color code e.g '#3e82f7'
   * @param {Number} percent - Percentage -100 to 100, positive for lighten, negative for darken
   * @return {String} Darken or lighten color
   */
  static shadeColor(color: any, percent: any) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
    R = parseInt(String((R * (100 + percent)) / 100));
    G = parseInt(String((G * (100 + percent)) / 100));
    B = parseInt(String((B * (100 + percent)) / 100));
    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;
    const RR =
      R.toString(16).length === 1 ? `0${R.toString(16)}` : R.toString(16);
    const GG =
      G.toString(16).length === 1 ? `0${G.toString(16)}` : G.toString(16);
    const BB =
      B.toString(16).length === 1 ? `0${B.toString(16)}` : B.toString(16);
    return `#${RR}${GG}${BB}`;
  }

  /**
   * Returns either a positive or negative
   * @param {Number} number - number value
   * @param {any} positive - value that return when positive
   * @param {any} negative - value that return when negative
   * @return {any} positive or negative value based on param
   */
  static getSignNum(number: number, positive: any, negative: any) {
    if (number > 0) {
      return positive;
    }
    if (number < 0) {
      return negative;
    }
    return null;
  }

  /**
   * Returns either ascending or descending value
   * @param {Object} a - antd Table sorter param a
   * @param {Object} b - antd Table sorter param b
   * @param {String} key - object key for compare
   * @return {any} a value minus b value
   */
  static antdTableSorter(a: any, b: any, key: any) {
    if (typeof a[key] === "number" && typeof b[key] === "number") {
      return a[key] - b[key];
    }

    if (typeof a[key] === "string" && typeof b[key] === "string") {
      a = a[key].toLowerCase();
      b = b[key].toLowerCase();
      return a > b ? -1 : b > a ? 1 : 0;
    }
    return;
  }

  /**
   * Filter array of object
   * @param {Array} list - array of objects that need to filter
   * @param {String} key - object key target
   * @param {any} value  - value that excluded from filter
   * @return {Array} a value minus b value
   */
  static filterArray(list: any, key: any, value: any) {
    let data = list;
    if (list) {
      data = list.filter((item: any) => item[key] === value);
    }
    return data;
  }

  static deleteArrayRow<T>(list: T[], key: keyof T, value: any) {
    let data = list;
    if (list) {
      data = list.filter((item) => item[key] !== value);
    }
    return data;
  }

  static hasKey<O>(obj: O, key: keyof any): key is keyof O {
    return key in obj;
  }

  static wildCardSearch<T>(list: T[], input: string) {
    list = list.filter((item) => {
      for (let key in item) {
        if (item[key] === null || key === "Logo" || key === "Photo") {
          continue;
        }
        if (
          item[key]
            //@ts-ignore
            .toString()
            .toUpperCase()
            .indexOf(input.toString().toUpperCase()) !== -1
        ) {
          return true;
        }
      }
    });
    return list;
  }

  /**
   * Get Breakpoint
   * @param {Object} screens - Grid.useBreakpoint() from antd
   * @return {Array} array of breakpoint size
   */
  static getBreakPoint(screens: any) {
    let breakpoints: any[] = [];
    for (const key in screens) {
      if (screens.hasOwnProperty(key)) {
        const element = screens[key];
        if (element) {
          breakpoints.push(key);
        }
      }
    }
    return breakpoints;
  }

  static encryptInput(input: string, publicKey: string) {
    const jsEncrypt = new JSEncrypt({});
    jsEncrypt.setPublicKey(publicKey);
    return jsEncrypt.encrypt(input);
  }

  /**
   * Add an item to a localStorage() object
   * @param {String} img  The img that was uploaded
   * @param {Function} callback Callback function to render img
   */
  static getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  static beforeUploadArticle(file: any): any {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (event) {
        const image: any = document.createElement("img");
        image.src = event!.target!.result;
        image.onload = function () {
          const isSquare = image.width === image.height;
          const isJpgOrPng =
            file.type === "image/jpeg" || file.type === "image/png";
          if (!isSquare) {
            message.error("Image must be 1:1 format");
          }
          if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
          }
          if (isSquare && isJpgOrPng) {
            resolve();
          } else {
            reject();
          }
        };
      };
    });
  }

  static beforeUpload(file: any): any {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 0.5;

    if (!isLt2M) {
      message.error("Image must be smaller than 500kb!");
    }
    const isSquare = file.width === file.height;
    return isJpgOrPng && isLt2M && isSquare;
  }

  static dummyRequest({ file, onSuccess }: any) {
    setTimeout(() => {
      onSuccess("ok");
    });
  }

  /**
   * Add an item to a localStorage() object
   * @param {Array} array - the array of objects that has to be sorted
   * @param {String | Number} key - any value to search
   * @return {Array} - a new sorted array
   */
  static sortData(array: any, key: any) {
    return array.slice().sort((a: any, b: any) => a[key] - b[key]);
  }

  static decodeBase64Locale(data: any) {
    try {
      const str = data.toString();
      return JSON.parse(decodeURIComponent(window.atob(str)));
    } catch {
      return { en: "", ro: "", ru: "" };
    }
  }

  static encodeBase64Locale(obj: any) {
    try {
      return window.btoa(encodeURIComponent(JSON.stringify(obj)));
    } catch {}
  }

  static encodeBase64(obj: any) {
    try {
      return window.btoa(encodeURIComponent(JSON.stringify(obj)));
    } catch {
      return "";
    }
  }

  static decodeBase64(obj: any) {
    try {
      const str = obj.toString();
      return JSON.parse(decodeURIComponent(window.atob(str)));
    } catch {
      return {};
    }
  }
}

export default Utils;

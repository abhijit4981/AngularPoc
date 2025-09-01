/**********String Prototypes*************/
interface String {
  toPascalCase: () => string;
  toBoolean: () => boolean;
  toNumber: () => number;
  slugify: () => string;
  encode: () => string;
  decode: () => string;
  equals: (match: string, ignoreCase?: boolean) => boolean;
}

interface StringConstructor {
  isNullOrEmpty: (val: any) => boolean;
}

String.prototype.toPascalCase = function(): string {
  return this.replace(/(\w)(\w*)/g, function(g0, g1, g2) {
    return g1.toUpperCase() + g2.toLowerCase();
  });
};

String.prototype.toBoolean = function(): boolean {
  const value = this.valueOf();
  if ((<any>String).isNullOrEmpty(value)) {
    return false;
  } else if (
    value.toLowerCase() === 'true' ||
    value.toLowerCase() === '1' ||
    value.toLowerCase() === 'y' ||
    value.toLowerCase() === 'yes'
  ) {
    return true;
  }
  return false;
};

String.prototype.toNumber = function(): number {
  return parseInt(this, 0);
};

String.prototype.slugify = function(): string {
  let text = this.toString()
    .toLowerCase()
    .trim();

  const sets = [
    { to: 'a', from: '[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]' },
    { to: 'c', from: '[ÇĆĈČ]' },
    { to: 'd', from: '[ÐĎĐÞ]' },
    { to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]' },
    { to: 'g', from: '[ĜĞĢǴ]' },
    { to: 'h', from: '[ĤḦ]' },
    { to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]' },
    { to: 'j', from: '[Ĵ]' },
    { to: 'ij', from: '[Ĳ]' },
    { to: 'k', from: '[Ķ]' },
    { to: 'l', from: '[ĹĻĽŁ]' },
    { to: 'm', from: '[Ḿ]' },
    { to: 'n', from: '[ÑŃŅŇ]' },
    { to: 'o', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]' },
    { to: 'oe', from: '[Œ]' },
    { to: 'p', from: '[ṕ]' },
    { to: 'r', from: '[ŔŖŘ]' },
    { to: 's', from: '[ßŚŜŞŠ]' },
    { to: 't', from: '[ŢŤ]' },
    { to: 'u', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]' },
    { to: 'w', from: '[ẂŴẀẄ]' },
    { to: 'x', from: '[ẍ]' },
    { to: 'y', from: '[ÝŶŸỲỴỶỸ]' },
    { to: 'z', from: '[ŹŻŽ]' },
    { to: '-', from: '[·/_,:;\']' } // '[·/_,:;\']'
  ];

  sets.forEach(set => {
    text = text.replace(new RegExp(set.from, 'gi'), set.to);
  });

  return text
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

String.prototype.encode = function(): string {
  return encodeURIComponent(this.trim());
};

String.prototype.decode = function(): string {
  return decodeURIComponent(this);
};

String.prototype.equals = function(
  match: string,
  ignoreCase: boolean = true
): boolean {
  return ignoreCase
    ? this.valueOf().toLowerCase() === match.toString().toLowerCase()
    : this === match;
};

String.isNullOrEmpty = function(val: any): boolean {
  if (
    val === undefined ||
    val === null ||
    val.trim() === '' ||
    val.trim().toLowerCase() === 'null'
  ) {
    return true;
  }
  return false;
};
/**********String Prototypes*************/

/**********Number Prototypes*************/
interface Number {
  toBoolean: () => boolean;
  length: () => number;
  padStart: (maxLength: number, fillNumber: number) => string;
}

Number.prototype.toBoolean = function(): boolean {
  return this.valueOf() === 0 ? false : true;
};

Number.prototype.length = function(): number {
  return this.valueOf().toString().length;
};

Number.prototype.padStart = function(
  maxLength: number,
  fillNumber: number
): string {
  let value = this.valueOf().toString();
  value = value.padStart(maxLength, fillNumber.toString());
  return value;
};
/**********Number Prototypes*************/

/**********Array Prototypes*************/
interface Array<T> {
  empty: () => Array<any>;
  isEmpty: () => boolean;
  remove: (item: any) => any;
  contains: (partial: string, strict: boolean) => boolean;
  indexOfPartial: (partial: string) => number;
  toObjectArray: (objName: string) => Array<any>;
  orderBy: (propName: string) => Array<any>;
  orderByForStringField: (propName: string) => Array<any>;
  distinct: () => Array<any>;
}

Array.prototype.empty = function(): Array<any> {
  return this.splice(0, this.length);
};

Array.prototype.isEmpty = function(): boolean {
  if (this.length === 0) {
    return true;
  }
  return false;
};

Array.prototype.remove = function(item: any): any {
  const index: Number = this.indexOf(item);
  if (index !== -1) {
    return this.splice(index, 1);
  }
  return null;
};

Array.prototype.contains = function(partial: string, strict: boolean): boolean {
  for (let i: any = 0; i < this.length; i++) {
    if (!strict && this[i].contains(partial)) {
      return true;
    }
    if (strict && this[i] === partial) {
      return true;
    }
  }
  return false;
};

Array.prototype.indexOfPartial = function(partial: string): number {
  for (let i: any = 0; i < this.length; i++) {
    if (this[i].contains(partial)) {
      return i;
    }
  }
  return -1;
};

Array.prototype.toObjectArray = function(objName: string): Array<any> {
  if (objName === undefined || objName === null) {
    return;
  }
  const items: any = this;
  if (
    typeof items[0] === 'string' ||
    typeof items[0] === 'number' ||
    typeof items[0] === 'boolean'
  ) {
    for (let i: any = 0; i < items.length; i++) {
      const val: any = items[i];
      items[i] = {};
      items[i][objName] = val;
    }
    return items;
  } else {
    return this;
  }
};

Array.prototype.orderBy = function(propName): Array<any> {
  return this.sort(function(a, b) {
    if (a[propName] < b[propName]) {
      return -1;
    }
    if (a[propName] > b[propName]) {
      return 1;
    }
    return 0;
  });
};

Array.prototype.orderByForStringField = function(propName): Array<any> {
  return this.sort(function(a, b) {
    if (a[propName] < b[propName]) {
      return -1;
    }
    if (a[propName] > b[propName]) {
      return 1;
    }
    return 0;
  });
};

Array.prototype.distinct = function(): Array<any> {
  return this.filter((value, index) => this.indexOf(value) === index);
};
/**********Array Prototypes*************/

/**********Date Prototypes*************/

interface Date {
  equals: (match: Date) => boolean;
  format: () => string;
}

Date.prototype.equals = function(match: Date): boolean {
  return new Date(this.valueOf()).getTime() === match.getTime();
};

Date.prototype.format = function(): string {
  // Need to replace this characters in date string to resolve parse issue in IE browser
  return new Date(this.valueOf())
    .toLocaleDateString()
    .replace(
      /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
      ''
    );
};

/**********Array Prototypes*************/

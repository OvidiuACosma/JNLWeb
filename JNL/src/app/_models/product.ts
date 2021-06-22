export interface Product {
    brand: string;
    family: string;
    model: string;
}

export interface ProductEF {
    brand: string;
    categoryFr: string;
    categoryEn: string;
    familyFr: string;
    familyEn: string;
    model: string;
    indexFamily: number;
    indexModel: number;
    indexBrand: number;
    imageAltFr: string;
    imageAltEn: string;
    id: number;
}

export interface ProductHeroImage {
    brand: string;
    imageId: number;
    imageIndex: number;
    imageName: string;
    product: string;
}

export interface Finissage {
    brand: string;
    id: number;
    materialId: number;
    name: string;
    material: string;
    img: string;
}

export interface ProductTDImage {
  src: string;
  prodCode: string;
}

export interface IGarnissageDto {
  materialFr: string;
  model: string;
}

export interface IGarnissage {
  id: number;
  codeProd: string;
  familyFr: string;
  familyEn: string;
  materialFr: string;
  materialEn: string;
  model: string;
  dimensions: string;
  compositionFr: string;
  compositionEn: string;
  martindale: string;
  gaCoussinOnly: boolean;
  brand: number;
  colorEn: string;
  colorFr: string;
  colorRef: string;
  ordIndex: number;
  gaColors: string;
}

export interface IGarnissageColors {
  id: number;
  color: string;
  colorFr: string;
}

export interface IProdGarnissage {
  id: number;
  codeProd: string;
  material: string;
  model: string;
  dimensions: string;
  composition: string;
  martindale: string;
  type: string;
  brand: string;
  color: string;
  colorRef: string;
  gaColors: string[];
}

export interface IProductReadyToSell {
  id: number;
  familyFr: string;
  familyEn: string;
  model: string;
  brand: string;
  descriptionFr: string;
  descriptionEn: string;
  qty: number;
  price: number;
  index: number;
}

export interface IGarnissageRts {
  id: number;
  productId: number;
  garnissageId: string;
}


export interface IProductToFavorites {
  brand: string;
  id: number;
  id2: number;
  type: number;
  prodCode: string;
  family: string;
  model: string;
  text: string;
}

export interface IProductDescription {
  id: number;
  brand: string;
  familyFr: string;
  familyEn: string;
  model: string;
  descriptionFr: string;
  descriptionEn: string;
  partIndex: number;
  partNameFr: string;
  partNameEn: string;
  categoryFr: string;
  categoryEn: string;
  materialNameFr: string;
  materialNameEn: string;
  materialCategory: number;
  finisageNameFr: string;
  finisageNameEn: string;
  finId: number;
  matId: number;
  tarifIndex: number;
}

export interface IFilter {
  index: number;
  checked: boolean;
  displayName: string;
}

export interface IFilterElements {
  filterGroup: string;
  filterElement: IFilter[];
}

export interface IProductsFiltersCached {
  searchText: string;
  filteredItems: boolean[];
  filteredElements: IFilterElements[];
}

export interface IProductShareByEmail {
  product: string;
  productUrl: string;
  imageUrl: string;
  senderName: string;
  senderEmail: string;
  recipientEmails: string[];
  message: string;
}

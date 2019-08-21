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

export interface Finisage {
    name: string;
    material: string;
    img: string;
}

export interface ProductTDImage {
  src: string;
  prodCode: string;
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
}

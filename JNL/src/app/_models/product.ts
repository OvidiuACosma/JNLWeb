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

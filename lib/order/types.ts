import React from 'react';

export interface ApparelSizes {
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
}

export interface OrderSpecs {
  size: string;
  sides: string;
  lamination: string;
  quantity: number;
  width: number;
  height: number;
  eyelets: string;
  innerSheets: string;
  binding: string;
  cover: string;
  idType: string;
  stock: string;
  corners: string;
  paperType: string;
  apparelSizes: ApparelSizes;
  deadline: string;
  description: string;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  whatsapp: string;
  email: string;
  source: string;
}

export interface OrderCategoryItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

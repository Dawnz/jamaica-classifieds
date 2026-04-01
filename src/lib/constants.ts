// src/lib/constants.ts

export const PARISHES = [
  'Kingston',
  'St. Andrew',
  'St. Thomas',
  'Portland',
  'St. Mary',
  'St. Ann',
  'Trelawny',
  'St. James',
  'Hanover',
  'Westmoreland',
  'St. Elizabeth',
  'Manchester',
  'Clarendon',
  'St. Catherine',
] as const

export type Parish = typeof PARISHES[number]

// How long a free listing stays active (days)
export const FREE_LISTING_DAYS    = 30
export const PREMIUM_LISTING_DAYS = 90

// Premium listing price in JMD cents (J$1,500 = 150000)
export const PREMIUM_PRICE_JMD = 150000

// Category-specific filter field definitions
export const CATEGORY_FILTERS: Record<string, FilterField[]> = {
  'auto': [
    { key: 'make',      label: 'Make',      type: 'select', options: ['Toyota','Honda','Nissan','Suzuki','Mitsubishi','BMW','Mercedes-Benz','Ford','Hyundai','Kia','Mazda','Subaru','Other'] },
    { key: 'model',     label: 'Model',     type: 'text',   placeholder: 'e.g. Corolla' },
    { key: 'year',      label: 'Year',      type: 'select', options: Array.from({length:20},(_,i)=>(2024-i).toString()) },
    { key: 'condition', label: 'Condition', type: 'select', options: ['New','Used','For Parts'] },
    { key: 'transmission', label: 'Transmission', type: 'select', options: ['Automatic','Manual'] },
  ],
  'real-estate': [
    { key: 'type',      label: 'Type',      type: 'select', options: ['House','Apartment','Land','Commercial','Villa','Room','Office'] },
    { key: 'listing',   label: 'For',       type: 'select', options: ['Sale','Rent'] },
    { key: 'bedrooms',  label: 'Bedrooms',  type: 'select', options: ['Studio','1','2','3','4','5','6+'] },
    { key: 'bathrooms', label: 'Bathrooms', type: 'select', options: ['1','2','3','4+'] },
    { key: 'furnished', label: 'Furnished', type: 'select', options: ['Any','Furnished','Unfurnished'] },
  ],
  'jobs': [
    { key: 'jobType',  label: 'Job Type', type: 'select', options: ['Full-time','Part-time','Contract','Freelance','Remote','Internship'] },
    { key: 'industry', label: 'Industry', type: 'select', options: ['Finance','IT','Healthcare','Education','Hospitality','Legal','Sales','Construction','Other'] },
  ],
  'mobile-devices': [
    { key: 'brand',     label: 'Brand',     type: 'select', options: ['Apple','Samsung','Huawei','Xiaomi','OnePlus','Google','Other'] },
    { key: 'condition', label: 'Condition', type: 'select', options: ['Brand New','Used - Excellent','Used - Good','Used - Fair','For Parts'] },
    { key: 'storage',   label: 'Storage',   type: 'select', options: ['64GB','128GB','256GB','512GB','1TB'] },
  ],
  'computers': [
    { key: 'type',      label: 'Type',      type: 'select', options: ['Laptop','Desktop','Tablet','Monitor','Parts','Other'] },
    { key: 'brand',     label: 'Brand',     type: 'select', options: ['Apple','Dell','HP','Lenovo','ASUS','Acer','Other'] },
    { key: 'condition', label: 'Condition', type: 'select', options: ['New','Used - Excellent','Used - Good','For Parts'] },
  ],
  'pets-animals': [
    { key: 'type',    label: 'Animal',  type: 'select', options: ['Dog','Cat','Bird','Fish','Reptile','Rabbit','Livestock','Other'] },
    { key: 'breed',   label: 'Breed',   type: 'text',   placeholder: 'e.g. Labrador' },
    { key: 'age',     label: 'Age',     type: 'select', options: ['Under 3 months','3–6 months','6–12 months','1–3 years','3+ years'] },
  ],
  'furniture': [
    { key: 'type',      label: 'Type',      type: 'select', options: ['Sofa / Couch','Bed','Wardrobe','Dining Table','Office Desk','Chair','Other'] },
    { key: 'condition', label: 'Condition', type: 'select', options: ['New','Like New','Good','Fair'] },
    { key: 'material',  label: 'Material',  type: 'select', options: ['Wood','Metal','Upholstered','Plastic','Glass','Other'] },
  ],
  'appliances': [
    { key: 'type',      label: 'Type',      type: 'select', options: ['Refrigerator','Washing Machine','Dryer','Stove / Oven','Air Conditioner','TV','Dishwasher','Microwave','Other'] },
    { key: 'brand',     label: 'Brand',     type: 'select', options: ['LG','Samsung','Sony','Whirlpool','Maytag','GE','Hisense','TCL','Other'] },
    { key: 'condition', label: 'Condition', type: 'select', options: ['New','Like New','Good','Fair','For Parts'] },
  ],
}

export interface FilterField {
  key:         string
  label:       string
  type:        'select' | 'text' | 'number'
  options?:    string[]
  placeholder?: string
}

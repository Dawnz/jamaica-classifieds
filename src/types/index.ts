export type Parish =
  | 'Kingston' | 'St. Andrew' | 'St. Catherine' | 'Clarendon'
  | 'Manchester' | 'St. Elizabeth' | 'Westmoreland' | 'Hanover'
  | 'St. James' | 'Trelawny' | 'St. Ann' | 'St. Mary'
  | 'Portland' | 'St. Thomas'

export const PARISHES: Parish[] = [
  'Kingston','St. Andrew','St. Catherine','Clarendon',
  'Manchester','St. Elizabeth','Westmoreland','Hanover',
  'St. James','Trelawny','St. Ann','St. Mary','Portland','St. Thomas',
]

export type CategoryWithCount = {
  id: string; name: string; slug: string; icon: string | null
  _count: { listings: number }
}

export type ListingCard = {
  id: string; title: string; priceLabel: string | null; parish: string
  tier: string; createdAt: Date
  category: { name: string; slug: string; icon: string | null }
  images: { url: string }[]
}

export type ListingFull = ListingCard & {
  description: string; price: number | null; address: string | null
  contactName: string | null; contactPhone: string | null; contactEmail: string | null
  viewCount: number; expiresAt: Date
  fields: { key: string; label: string; value: string }[]
  user: { name: string | null; image: string | null; createdAt: Date }
}

export const CATEGORY_FILTERS: Record<string, { key: string; label: string; options: string[] }[]> = {
  'auto': [
    { key: 'make', label: 'Make', options: ['Toyota','Honda','Nissan','Mitsubishi','Suzuki','BMW','Mercedes','Hyundai','Kia','Ford','Mazda'] },
    { key: 'year', label: 'Year', options: Array.from({length: 15}, (_,i) => String(2024 - i)) },
    { key: 'condition', label: 'Condition', options: ['New','Used - Excellent','Used - Good','Used - Fair','For Parts'] },
    { key: 'transmission', label: 'Transmission', options: ['Automatic','Manual'] },
  ],
  'real-estate': [
    { key: 'listing_type', label: 'Listing Type', options: ['For Sale','For Rent'] },
    { key: 'property_type', label: 'Property Type', options: ['House','Apartment','Land','Villa','Commercial','Townhouse'] },
    { key: 'bedrooms', label: 'Bedrooms', options: ['1','2','3','4','5+'] },
    { key: 'bathrooms', label: 'Bathrooms', options: ['1','2','3','4+'] },
  ],
  'jobs': [
    { key: 'job_type', label: 'Job Type', options: ['Full-time','Part-time','Contract','Remote','Internship'] },
    { key: 'industry', label: 'Industry', options: ['Finance','IT & Technology','Healthcare','Education','Hospitality','Construction','Sales','Administration'] },
  ],
  'mobile-devices': [
    { key: 'brand', label: 'Brand', options: ['Apple','Samsung','Xiaomi','Huawei','OnePlus','Google','Oppo'] },
    { key: 'condition', label: 'Condition', options: ['Brand New','Used - Excellent','Used - Good','For Parts'] },
  ],
  'computers': [
    { key: 'type', label: 'Type', options: ['Laptop','Desktop','Tablet','Monitor','Parts'] },
    { key: 'brand', label: 'Brand', options: ['Apple','Dell','HP','Lenovo','ASUS','Acer','Microsoft'] },
    { key: 'condition', label: 'Condition', options: ['Brand New','Used - Excellent','Used - Good'] },
  ],
}

import { PrismaClient, Role, ListingTier, ListingStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const CATEGORIES = [
  { name: 'Real Estate', slug: 'real-estate', icon: '🏡', order: 1, subs: ['Houses for Sale', 'Apartments for Sale', 'Land for Sale', 'Houses for Rent', 'Apartments for Rent', 'Commercial Property', 'Vacation Rentals'] },
  { name: 'Auto', slug: 'auto', icon: '🚗', order: 2, subs: ['Cars', 'SUVs & Trucks', 'Motorcycles', 'Boats', 'Auto Parts', 'Auto Services'] },
  { name: 'Jobs', slug: 'jobs', icon: '💼', order: 3, subs: ['Accounting & Finance', 'IT & Technology', 'Healthcare', 'Education', 'Hospitality & Tourism', 'Construction', 'Administration', 'Sales & Marketing'] },
  { name: 'Mobile Devices', slug: 'mobile-devices', icon: '📱', order: 4, subs: ['iPhones', 'Android Phones', 'Tablets', 'Phone Accessories', 'SIM Cards'] },
  { name: 'Computers', slug: 'computers', icon: '💻', order: 5, subs: ['Laptops', 'Desktops', 'Tablets & iPads', 'Monitors', 'Computer Parts', 'Printers'] },
  { name: 'Games', slug: 'games', icon: '🎮', order: 6, subs: ['PlayStation', 'Xbox', 'Nintendo', 'PC Games', 'Game Accessories'] },
  { name: 'Baby', slug: 'baby', icon: '🍼', order: 7, subs: ['Baby Clothes', 'Strollers & Prams', 'Baby Furniture', 'Toys', 'Baby Feeding', 'Safety Equipment'] },
  { name: 'Clothing & Accessories', slug: 'clothing-accessories', icon: '👗', order: 8, subs: ["Men's Clothing", "Women's Clothing", "Children's Clothing", 'Shoes', 'Bags & Purses', 'Watches', 'Hats & Caps'] },
  { name: 'Home & Office', slug: 'home-office', icon: '🛋️', order: 9, subs: ['Home Decor', 'Office Furniture', 'Kitchen & Dining', 'Bedding & Linen', 'Garden & Outdoor'] },
  { name: 'Other', slug: 'other', icon: '📦', order: 10, subs: ['Miscellaneous'] },
  { name: 'Cosmetics', slug: 'cosmetics', icon: '💄', order: 11, subs: ['Makeup', 'Skincare', 'Fragrances', 'Hair Products', 'Nail Products'] },
  { name: 'Pets & Animals', slug: 'pets-animals', icon: '🐾', order: 12, subs: ['Dogs', 'Cats', 'Birds', 'Fish & Aquarium', 'Pet Accessories', 'Pet Food', 'Farm Animals'] },
  { name: 'Media & Entertainment', slug: 'media-entertainment', icon: '🎵', order: 13, subs: ['Movies & DVDs', 'Music & CDs', 'Books', 'Musical Instruments', 'Cameras & Photography'] },
  { name: 'Services', slug: 'services', icon: '🔧', order: 14, subs: ['Plumbing', 'Electrical', 'Carpentry', 'Cleaning Services', 'Tutoring', 'Photography', 'Web & IT Services', 'Transportation', 'Event Planning'] },
  { name: 'Cleaning Supplies', slug: 'cleaning-supplies', icon: '🧹', order: 15, subs: ['Household Cleaning', 'Commercial Cleaning', 'Disinfectants'] },
  { name: 'Food & Beverages', slug: 'food-beverages', icon: '🍽️', order: 16, subs: ['Jamaican Food', 'Beverages', 'Snacks', 'Organic & Natural', 'Catering Services'] },
  { name: 'Jewelry', slug: 'jewelry', icon: '💍', order: 17, subs: ['Gold Jewelry', 'Silver Jewelry', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Watches'] },
  { name: 'Medical', slug: 'medical', icon: '⚕️', order: 18, subs: ['Medical Equipment', 'Mobility Aids', 'Health Supplements', 'Medical Services'] },
  { name: 'Personal Care & Beauty', slug: 'personal-care-beauty', icon: '🌸', order: 19, subs: ['Hair Care', 'Skin Care', 'Bath & Body', 'Oral Care', 'Beauty Services'] },
  { name: 'Furniture', slug: 'furniture', icon: '🪑', order: 20, subs: ['Living Room', 'Bedroom', 'Dining Room', 'Office Furniture', 'Outdoor Furniture', 'Custom Made'] },
  { name: 'Appliances', slug: 'appliances', icon: '🏷️', order: 21, subs: ['Refrigerators', 'Washing Machines', 'Stoves & Ovens', 'Air Conditioners', 'TVs', 'Small Appliances'] },
  { name: 'Sports & Fitness', slug: 'sports-fitness', icon: '⚽', order: 22, subs: ['Gym Equipment', 'Outdoor Sports', 'Water Sports', 'Team Sports', 'Cycling', 'Martial Arts'] },
]

const PARISHES = ['Kingston', 'St. Andrew', 'St. Catherine', 'Clarendon', 'Manchester', 'St. Elizabeth', 'Westmoreland', 'Hanover', 'St. James', 'Trelawny', 'St. Ann', 'St. Mary', 'Portland', 'St. Thomas']

function randomParish() { return PARISHES[Math.floor(Math.random() * PARISHES.length)] }
function randomTier(): ListingTier { return Math.random() > 0.75 ? 'PREMIUM' : 'FREE' }
function daysFromNow(days: number) { const d = new Date(); d.setDate(d.getDate() + days); return d }
function daysAgo(days: number) { const d = new Date(); d.setDate(d.getDate() - days); return d }

async function main() {
  console.log('🌱 Seeding Jamaica Classifieds...\n')

  // ── Users ──
  const adminPw = await bcrypt.hash('admin123!', 12)
  const userPw  = await bcrypt.hash('user123!', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@jamaicaclassifieds.com' },
    update: {},
    create: { email: 'admin@jamaicaclassifieds.com', name: 'Admin User', password: adminPw, role: Role.ADMIN, parish: 'Kingston', phone: '876-555-0001' },
  })

  const sellers = await Promise.all([
    prisma.user.upsert({ where: { email: 'demo@example.com' }, update: {}, create: { email: 'demo@example.com', name: 'Michael Brown', password: userPw, role: Role.USER, parish: 'Kingston', phone: '876-555-0100' } }),
    prisma.user.upsert({ where: { email: 'sharon@example.com' }, update: {}, create: { email: 'sharon@example.com', name: 'Sharon Campbell', password: userPw, role: Role.USER, parish: 'St. Andrew', phone: '876-555-0200' } }),
    prisma.user.upsert({ where: { email: 'david@example.com' }, update: {}, create: { email: 'david@example.com', name: 'David Reid', password: userPw, role: Role.USER, parish: 'St. James', phone: '876-555-0300' } }),
    prisma.user.upsert({ where: { email: 'kezia@example.com' }, update: {}, create: { email: 'kezia@example.com', name: 'Kezia Morgan', password: userPw, role: Role.USER, parish: 'St. Catherine', phone: '876-555-0400' } }),
    prisma.user.upsert({ where: { email: 'omar@example.com' }, update: {}, create: { email: 'omar@example.com', name: 'Omar Williams', password: userPw, role: Role.USER, parish: 'Clarendon', phone: '876-555-0500' } }),
  ])

  console.log(`✅ ${sellers.length + 1} users seeded`)

  // ── Categories ──
  const catMap: Record<string, string> = {}
  for (const cat of CATEGORIES) {
    const { subs, ...catData } = cat
    const record = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: { name: catData.name, icon: catData.icon, order: catData.order },
      create: catData,
    })
    catMap[cat.slug] = record.id
    for (const subName of subs) {
      const subSlug = subName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      await prisma.subCategory.upsert({
        where: { categoryId_slug: { categoryId: record.id, slug: subSlug } },
        update: { name: subName },
        create: { name: subName, slug: subSlug, categoryId: record.id },
      })
    }
  }
  console.log(`✅ ${CATEGORIES.length} categories seeded`)

  // ── Clear old listings ──
  await prisma.listingField.deleteMany()
  await prisma.listingImage.deleteMany()
  await prisma.listing.deleteMany()
  console.log('🗑️  Old listings cleared\n')

  // ── Helper ──
  async function createListing(data: {
    title: string; description: string; price: number | null; priceLabel: string
    parish: string; categorySlug: string; userId: string; tier?: ListingTier
    contactName: string; contactPhone: string; contactEmail: string
    daysUntilExpiry?: number; createdDaysAgo?: number
    fields?: { key: string; label: string; value: string }[]
  }) {
    return prisma.listing.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        priceLabel: data.priceLabel,
        parish: data.parish,
        categoryId: catMap[data.categorySlug],
        userId: data.userId,
        tier: data.tier ?? randomTier(),
        status: ListingStatus.ACTIVE,
        expiresAt: daysFromNow(data.daysUntilExpiry ?? 30),
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        createdAt: data.createdDaysAgo ? daysAgo(data.createdDaysAgo) : new Date(),
        fields: { create: data.fields ?? [] },
      },
    })
  }

  // ══════════════════════════════════════════
  // REAL ESTATE — 18 listings
  // ══════════════════════════════════════════
  console.log('🏡 Seeding Real Estate...')
  const reListings = [
    { title: '3 Bedroom House for Sale — Manor Park', price: 18500000, priceLabel: 'J$18,500,000', parish: 'St. Andrew', tier: 'PREMIUM' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'House' },{ key:'bedrooms',label:'Bedrooms',value:'3' },{ key:'bathrooms',label:'Bathrooms',value:'2' },{ key:'listing_type',label:'Listing Type',value:'For Sale' },{ key:'size_sqft',label:'Size (sq ft)',value:'1,800' }], desc: 'Beautiful fully furnished 3 bedroom, 2 bathroom house in the sought-after Manor Park area. Features include a modern kitchen, spacious living room, covered patio, and a private garage. Quiet, safe neighbourhood close to schools and shopping.' },
    { title: '2BR Apartment for Rent — Liguanea', price: 75000, priceLabel: 'J$75,000/mo', parish: 'St. Andrew', tier: 'FREE' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'Apartment' },{ key:'bedrooms',label:'Bedrooms',value:'2' },{ key:'bathrooms',label:'Bathrooms',value:'1' },{ key:'listing_type',label:'Listing Type',value:'For Rent' }], desc: 'Modern 2 bedroom apartment in the heart of Liguanea. Fully tiled, grilled windows, water tank, parking available. Close to Sovereign Centre and Half Way Tree. Utilities not included.' },
    { title: '5 Bedroom Villa — Ironshore, Montego Bay', price: 62000000, priceLabel: 'J$62,000,000', parish: 'St. James', tier: 'PREMIUM' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'Villa' },{ key:'bedrooms',label:'Bedrooms',value:'5' },{ key:'bathrooms',label:'Bathrooms',value:'4' },{ key:'listing_type',label:'Listing Type',value:'For Sale' },{ key:'size_sqft',label:'Size (sq ft)',value:'4,200' }], desc: 'Stunning 5 bedroom villa in prestigious Ironshore. Pool, fully gated, backup generator, staff quarters. Walking distance to Half Moon Golf Course. Perfect for luxury living or vacation rental income.' },
    { title: 'Half Acre Land for Sale — Portmore', price: 4500000, priceLabel: 'J$4,500,000', parish: 'St. Catherine', tier: 'FREE' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'Land' },{ key:'listing_type',label:'Listing Type',value:'For Sale' },{ key:'size_sqft',label:'Size',value:'0.5 acres' }], desc: 'Level residential lot in Portmore. Road frontage, electricity and water available. Title in hand. Quiet area suitable for family home construction. Close to shopping and schools.' },
    { title: 'Commercial Space for Rent — Half Way Tree', price: 180000, priceLabel: 'J$180,000/mo', parish: 'St. Andrew', tier: 'PREMIUM' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'Commercial' },{ key:'listing_type',label:'Listing Type',value:'For Rent' },{ key:'size_sqft',label:'Size (sq ft)',value:'1,200' }], desc: 'Prime commercial space on Constant Spring Road, Half Way Tree. Ground floor, high foot traffic, AC, bathroom facilities, kitchenette. Ideal for office, retail or food service.' },
    { title: '1 Bedroom Apartment — New Kingston', price: 55000, priceLabel: 'J$55,000/mo', parish: 'Kingston', tier: 'FREE' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'Apartment' },{ key:'bedrooms',label:'Bedrooms',value:'1' },{ key:'bathrooms',label:'Bathrooms',value:'1' },{ key:'listing_type',label:'Listing Type',value:'For Rent' }], desc: 'Cozy furnished 1 bedroom apartment in New Kingston. Walking distance to Emancipation Park. Security, parking, cable and internet included. Perfect for working professional.' },
    { title: '4BR House for Sale — Havendale', price: 28000000, priceLabel: 'J$28,000,000', parish: 'St. Andrew', tier: 'PREMIUM' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'House' },{ key:'bedrooms',label:'Bedrooms',value:'4' },{ key:'bathrooms',label:'Bathrooms',value:'3' },{ key:'listing_type',label:'Listing Type',value:'For Sale' }], desc: '4 bedroom 3 bathroom family home in gated Havendale community. Recently renovated kitchen and bathrooms, large yard, double garage. Solar panels installed. Must see!' },
    { title: 'Beachfront Land — Ocho Rios', price: 12000000, priceLabel: 'J$12,000,000', parish: 'St. Ann', tier: 'PREMIUM' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'Land' },{ key:'listing_type',label:'Listing Type',value:'For Sale' },{ key:'size_sqft',label:'Size',value:'1.2 acres' }], desc: '1.2 acres of prime beachfront land in Ocho Rios. Title ready, surveyed. Ideal for hotel, resort or luxury residential development. Once in a lifetime opportunity.' },
    { title: 'Studio Apartment — Downtown Kingston', price: 35000, priceLabel: 'J$35,000/mo', parish: 'Kingston', tier: 'FREE' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'Apartment' },{ key:'bedrooms',label:'Bedrooms',value:'Studio' },{ key:'listing_type',label:'Listing Type',value:'For Rent' }], desc: 'Affordable studio apartment near UWI bus route. Tiled floors, security bars, water included. Ideal for student or single professional. No pets.' },
    { title: '3BR Townhouse — Portmore, Edgewater', price: 9500000, priceLabel: 'J$9,500,000', parish: 'St. Catherine', tier: 'FREE' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'Townhouse' },{ key:'bedrooms',label:'Bedrooms',value:'3' },{ key:'bathrooms',label:'Bathrooms',value:'2' },{ key:'listing_type',label:'Listing Type',value:'For Sale' }], desc: 'Well maintained townhouse in Edgewater, Portmore. 3 bedrooms, 2 bathrooms, carport. Gated community, 24hr security. Low maintenance fees. Close to shopping plaza.' },
    { title: 'Office Space for Rent — New Kingston', price: 250000, priceLabel: 'J$250,000/mo', parish: 'Kingston', tier: 'PREMIUM' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'Commercial' },{ key:'listing_type',label:'Listing Type',value:'For Rent' },{ key:'size_sqft',label:'Size (sq ft)',value:'2,000' }], desc: 'Premium Grade A office space in New Kingston business district. Open plan layout, meeting rooms, reception, backup generator, parking. Ideal for financial services or law firm.' },
    { title: '2BR Cottage — Blue Mountains', price: 7800000, priceLabel: 'J$7,800,000', parish: 'St. Andrew', tier: 'FREE' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'House' },{ key:'bedrooms',label:'Bedrooms',value:'2' },{ key:'bathrooms',label:'Bathrooms',value:'1' },{ key:'listing_type',label:'Listing Type',value:'For Sale' }], desc: 'Charming 2 bedroom mountain cottage with stunning views. Spring water, fruit trees, large verandah. Very peaceful and private. 40 minutes from Kingston. Perfect weekend retreat.' },
    { title: 'Vacant Land — Mandeville', price: 3200000, priceLabel: 'J$3,200,000', parish: 'Manchester', tier: 'FREE' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'Land' },{ key:'listing_type',label:'Listing Type',value:'For Sale' },{ key:'size_sqft',label:'Size',value:'10,000 sq ft' }], desc: '10,000 sq ft corner lot in residential Mandeville. All utilities at boundary. Cool climate, great neighbours. Clear title available immediately.' },
    { title: '3BR House for Rent — Constant Spring', price: 120000, priceLabel: 'J$120,000/mo', parish: 'St. Andrew', tier: 'FREE' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'House' },{ key:'bedrooms',label:'Bedrooms',value:'3' },{ key:'bathrooms',label:'Bathrooms',value:'2' },{ key:'listing_type',label:'Listing Type',value:'For Rent' }], desc: 'Spacious 3 bedroom house in Constant Spring Gardens. Large yard, carport, water tank, helper room. Near Liguanea Club and top schools. 3 months deposit required.' },
    { title: 'Luxury Penthouse — New Kingston', price: 350000, priceLabel: 'J$350,000/mo', parish: 'Kingston', tier: 'PREMIUM' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'Apartment' },{ key:'bedrooms',label:'Bedrooms',value:'3' },{ key:'bathrooms',label:'Bathrooms',value:'3' },{ key:'listing_type',label:'Listing Type',value:'For Rent' }], desc: 'Stunning penthouse on the 18th floor with panoramic city views. Fully furnished, smart home system, private rooftop terrace, gym and pool access. Available for corporate or diplomatic tenancy.' },
    { title: 'Farm Land — St. Elizabeth', price: 8500000, priceLabel: 'J$8,500,000', parish: 'St. Elizabeth', tier: 'FREE' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'Land' },{ key:'listing_type',label:'Listing Type',value:'For Sale' },{ key:'size_sqft',label:'Size',value:'5 acres' }], desc: '5 acres of prime agricultural land in the breadbasket of Jamaica. Currently planted in scotch bonnet peppers and escallion. River boundary, irrigation available. Title in hand.' },
    { title: '5BR Family Home — Cherry Gardens', price: 45000000, priceLabel: 'J$45,000,000', parish: 'St. Andrew', tier: 'PREMIUM' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'House' },{ key:'bedrooms',label:'Bedrooms',value:'5' },{ key:'bathrooms',label:'Bathrooms',value:'4' },{ key:'listing_type',label:'Listing Type',value:'For Sale' }], desc: 'Grand family residence in Cherry Gardens. 5 bedrooms, 4 bathrooms, formal dining, family room, home office, swimming pool and fully landscaped garden. Staff quarters, double garage, generator.' },
    { title: '1BR Apt for Rent — Spanish Town', price: 28000, priceLabel: 'J$28,000/mo', parish: 'St. Catherine', tier: 'FREE' as ListingTier, fields: [{ key:'property_type',label:'Property Type',value:'Apartment' },{ key:'bedrooms',label:'Bedrooms',value:'1' },{ key:'bathrooms',label:'Bathrooms',value:'1' },{ key:'listing_type',label:'Listing Type',value:'For Rent' }], desc: 'Affordable 1 bedroom apartment in Spanish Town. Tiled, grilled, water tank, gated yard. Close to transport links and market. Ideal for young couple or single professional.' },
  ]

  for (let i = 0; i < reListings.length; i++) {
    const l = reListings[i]
    const seller = sellers[i % sellers.length]
    await createListing({ title: l.title, description: l.desc, price: l.price, priceLabel: l.priceLabel, parish: l.parish, categorySlug: 'real-estate', userId: seller.id, tier: l.tier, contactName: seller.name!, contactPhone: seller.phone!, contactEmail: seller.email, daysUntilExpiry: l.tier === 'PREMIUM' ? 60 : 30, createdDaysAgo: i, fields: l.fields })
  }
  console.log(`  ✓ ${reListings.length} real estate listings`)

  // ══════════════════════════════════════════
  // AUTO — 16 listings
  // ══════════════════════════════════════════
  console.log('🚗 Seeding Auto...')
  const autoListings = [
    { title: '2019 Toyota Corolla — Low mileage, great condition', price: 2800000, priceLabel: 'J$2,800,000', parish: 'Kingston', tier: 'PREMIUM' as ListingTier, fields: [{ key:'make',label:'Make',value:'Toyota' },{ key:'model',label:'Model',value:'Corolla' },{ key:'year',label:'Year',value:'2019' },{ key:'mileage',label:'Mileage',value:'42,000 km' },{ key:'transmission',label:'Transmission',value:'Automatic' },{ key:'fuel_type',label:'Fuel Type',value:'Petrol' },{ key:'condition',label:'Condition',value:'Used - Excellent' },{ key:'colour',label:'Colour',value:'Silver' }], desc: 'Well maintained 2019 Toyota Corolla. Single owner, full service history, no accidents. Reverse camera, Bluetooth, push start. Available for viewing in Kingston.' },
    { title: 'Honda CR-V 2021 — AWD, panoramic roof', price: 4200000, priceLabel: 'J$4,200,000', parish: 'Manchester', tier: 'PREMIUM' as ListingTier, fields: [{ key:'make',label:'Make',value:'Honda' },{ key:'model',label:'Model',value:'CR-V' },{ key:'year',label:'Year',value:'2021' },{ key:'mileage',label:'Mileage',value:'28,000 km' },{ key:'transmission',label:'Transmission',value:'Automatic' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: '2021 Honda CR-V AWD with panoramic sunroof, leather seats, Apple CarPlay. Full dealership service history. No accidents, non-smoker vehicle. Must see to appreciate.' },
    { title: 'Suzuki Alto 2020 — Perfect first car', price: 1450000, priceLabel: 'J$1,450,000', parish: 'Clarendon', tier: 'FREE' as ListingTier, fields: [{ key:'make',label:'Make',value:'Suzuki' },{ key:'model',label:'Model',value:'Alto' },{ key:'year',label:'Year',value:'2020' },{ key:'mileage',label:'Mileage',value:'55,000 km' },{ key:'transmission',label:'Transmission',value:'Automatic' },{ key:'condition',label:'Condition',value:'Used - Good' }], desc: 'Economic and reliable Suzuki Alto. Great on fuel, easy to park, perfect for city driving. AC works, tyres good. Minor scratches but mechanically sound.' },
    { title: 'BMW 3 Series 2018 — Sport Package', price: 5800000, priceLabel: 'J$5,800,000', parish: 'St. Andrew', tier: 'PREMIUM' as ListingTier, fields: [{ key:'make',label:'Make',value:'BMW' },{ key:'model',label:'Model',value:'3 Series' },{ key:'year',label:'Year',value:'2018' },{ key:'mileage',label:'Mileage',value:'65,000 km' },{ key:'transmission',label:'Transmission',value:'Automatic' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: 'BMW 320i Sport Package in excellent condition. M-Sport body kit, upgraded wheels, iDrive navigation. Regularly serviced at BMW Kingston. Serious enquiries only.' },
    { title: 'Toyota Hiace Bus — 15 seater, 2017', price: 3900000, priceLabel: 'J$3,900,000', parish: 'St. Catherine', tier: 'FREE' as ListingTier, fields: [{ key:'make',label:'Make',value:'Toyota' },{ key:'model',label:'Model',value:'Hiace' },{ key:'year',label:'Year',value:'2017' },{ key:'mileage',label:'Mileage',value:'98,000 km' },{ key:'transmission',label:'Transmission',value:'Manual' },{ key:'condition',label:'Condition',value:'Used - Good' }], desc: '15 seater Toyota Hiace minibus, currently operating on route 22. Engine recently overhauled, new tyres, AC. Plate included. Profitable business opportunity.' },
    { title: 'Mitsubishi Outlander 2020 — 7 Seater', price: 4650000, priceLabel: 'J$4,650,000', parish: 'Kingston', tier: 'PREMIUM' as ListingTier, fields: [{ key:'make',label:'Make',value:'Mitsubishi' },{ key:'model',label:'Model',value:'Outlander' },{ key:'year',label:'Year',value:'2020' },{ key:'mileage',label:'Mileage',value:'41,000 km' },{ key:'transmission',label:'Transmission',value:'Automatic' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: '7 seater Mitsubishi Outlander, perfect family vehicle. AWD, reversing camera, heated seats, dual zone AC. Non-smoker, no accidents. Available for test drive.' },
    { title: 'Nissan March 2016 — Reliable & Economical', price: 980000, priceLabel: 'J$980,000', parish: 'St. James', tier: 'FREE' as ListingTier, fields: [{ key:'make',label:'Make',value:'Nissan' },{ key:'model',label:'Model',value:'March' },{ key:'year',label:'Year',value:'2016' },{ key:'mileage',label:'Mileage',value:'82,000 km' },{ key:'transmission',label:'Transmission',value:'Automatic' },{ key:'condition',label:'Condition',value:'Used - Good' }], desc: 'Reliable Nissan March, great fuel economy. AC works, radio, power windows. Body in decent shape, minor rust on undercarriage. Good daily commuter car at an affordable price.' },
    { title: 'Toyota RAV4 2022 — Like New', price: 6200000, priceLabel: 'J$6,200,000', parish: 'St. Andrew', tier: 'PREMIUM' as ListingTier, fields: [{ key:'make',label:'Make',value:'Toyota' },{ key:'model',label:'Model',value:'RAV4' },{ key:'year',label:'Year',value:'2022' },{ key:'mileage',label:'Mileage',value:'18,000 km' },{ key:'transmission',label:'Transmission',value:'Automatic' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: 'Almost brand new 2022 Toyota RAV4 Hybrid. Lane assist, adaptive cruise control, 360 camera, wireless Apple CarPlay. Owner leaving Jamaica, must sell quickly.' },
    { title: 'Honda Fit 2018 — Clean title', price: 1750000, priceLabel: 'J$1,750,000', parish: 'Westmoreland', tier: 'FREE' as ListingTier, fields: [{ key:'make',label:'Make',value:'Honda' },{ key:'model',label:'Model',value:'Fit' },{ key:'year',label:'Year',value:'2018' },{ key:'mileage',label:'Mileage',value:'62,000 km' },{ key:'transmission',label:'Transmission',value:'Automatic' },{ key:'condition',label:'Condition',value:'Used - Good' }], desc: 'Clean Honda Fit Jazz in good overall condition. New battery, serviced 3 months ago. AC cold, all power windows work. Minor dent on rear bumper. Clean title, no lien.' },
    { title: 'Mercedes C-Class 2019 — Fully loaded', price: 7500000, priceLabel: 'J$7,500,000', parish: 'Kingston', tier: 'PREMIUM' as ListingTier, fields: [{ key:'make',label:'Make',value:'Mercedes' },{ key:'model',label:'Model',value:'C-Class' },{ key:'year',label:'Year',value:'2019' },{ key:'mileage',label:'Mileage',value:'48,000 km' },{ key:'transmission',label:'Transmission',value:'Automatic' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: 'Stunning Mercedes-Benz C300 AMG Line. Burmester sound system, panoramic roof, heads-up display, heated and ventilated seats. Full service at Mercedes Kingston. A true luxury experience.' },
    { title: 'Kia Sportage 2020 — Family SUV', price: 3800000, priceLabel: 'J$3,800,000', parish: 'St. Ann', tier: 'FREE' as ListingTier, fields: [{ key:'make',label:'Make',value:'Kia' },{ key:'model',label:'Model',value:'Sportage' },{ key:'year',label:'Year',value:'2020' },{ key:'mileage',label:'Mileage',value:'52,000 km' },{ key:'transmission',label:'Transmission',value:'Automatic' },{ key:'condition',label:'Condition',value:'Used - Good' }], desc: 'Practical Kia Sportage in good condition. Rear camera, touchscreen stereo, cruise control. Slight wear on front seats. Well maintained and reliable for family use.' },
    { title: 'Honda CBR 600 Motorcycle 2019', price: 1200000, priceLabel: 'J$1,200,000', parish: 'Kingston', tier: 'FREE' as ListingTier, fields: [{ key:'make',label:'Make',value:'Honda' },{ key:'model',label:'Model',value:'CBR 600' },{ key:'year',label:'Year',value:'2019' },{ key:'mileage',label:'Mileage',value:'21,000 km' },{ key:'transmission',label:'Transmission',value:'Manual' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: 'Sport motorcycle in excellent condition. Always garaged, never dropped. Aftermarket exhaust, new chain and sprockets. Serious riders only. Helmet and gear also available.' },
    { title: 'Toyota Fortuner 2021 — 7 Seater 4x4', price: 7800000, priceLabel: 'J$7,800,000', parish: 'St. Mary', tier: 'PREMIUM' as ListingTier, fields: [{ key:'make',label:'Make',value:'Toyota' },{ key:'model',label:'Model',value:'Fortuner' },{ key:'year',label:'Year',value:'2021' },{ key:'mileage',label:'Mileage',value:'35,000 km' },{ key:'transmission',label:'Transmission',value:'Automatic' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: 'Powerful Toyota Fortuner 4x4. Perfect for Jamaica terrain. 3rd row seating, leather interior, DVD screens, tow package. Regular service history. Ideal for family or business use.' },
    { title: 'Hyundai Tucson 2022 — Warranty Remaining', price: 5200000, priceLabel: 'J$5,200,000', parish: 'St. Catherine', tier: 'FREE' as ListingTier, fields: [{ key:'make',label:'Make',value:'Hyundai' },{ key:'model',label:'Model',value:'Tucson' },{ key:'year',label:'Year',value:'2022' },{ key:'mileage',label:'Mileage',value:'22,000 km' },{ key:'transmission',label:'Transmission',value:'Automatic' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: 'Nearly new Hyundai Tucson with factory warranty remaining. Advanced safety features, wireless charging, smart cruise control. One owner, bought from dealership. Transferable warranty.' },
    { title: 'Mazda CX-5 2020 — Sunroof & Leather', price: 4100000, priceLabel: 'J$4,100,000', parish: 'Portland', tier: 'FREE' as ListingTier, fields: [{ key:'make',label:'Make',value:'Mazda' },{ key:'model',label:'Model',value:'CX-5' },{ key:'year',label:'Year',value:'2020' },{ key:'mileage',label:'Mileage',value:'47,000 km' },{ key:'transmission',label:'Transmission',value:'Automatic' },{ key:'condition',label:'Condition',value:'Used - Good' }], desc: 'Stylish Mazda CX-5 with sunroof, leather seats and Bose sound system. AWD, lane departure warning, blind spot monitoring. Clean accident history. Viewing in Port Antonio.' },
    { title: 'Auto Parts — Toyota Axio Body Parts', price: 45000, priceLabel: 'J$45,000', parish: 'Kingston', tier: 'FREE' as ListingTier, fields: [{ key:'make',label:'Make',value:'Toyota' },{ key:'model',label:'Model',value:'Axio' },{ key:'condition',label:'Condition',value:'Used - Good' }], desc: 'Selling Toyota Axio body parts after minor collision. Hood, front bumper, headlights and grille available. All in good condition. Great for anyone repairing an Axio. Call for full parts list.' },
  ]

  for (let i = 0; i < autoListings.length; i++) {
    const l = autoListings[i]
    const seller = sellers[i % sellers.length]
    await createListing({ title: l.title, description: l.desc, price: l.price, priceLabel: l.priceLabel, parish: l.parish, categorySlug: 'auto', userId: seller.id, tier: l.tier, contactName: seller.name!, contactPhone: seller.phone!, contactEmail: seller.email, createdDaysAgo: i, fields: l.fields })
  }
  console.log(`  ✓ ${autoListings.length} auto listings`)

  // ══════════════════════════════════════════
  // MOBILE DEVICES — 10 listings
  // ══════════════════════════════════════════
  console.log('📱 Seeding Mobile Devices...')
  const mobileListings = [
    { title: 'iPhone 15 Pro Max 256GB — Natural Titanium', price: 165000, priceLabel: 'J$165,000', parish: 'St. Catherine', tier: 'PREMIUM' as ListingTier, fields: [{ key:'brand',label:'Brand',value:'Apple' },{ key:'model',label:'Model',value:'iPhone 15 Pro Max' },{ key:'storage',label:'Storage',value:'256GB' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: 'iPhone 15 Pro Max purchased 3 months ago. Original box, charger and case included. Screen protector on from day one. No scratches or damage. Face ID works perfectly.' },
    { title: 'Samsung Galaxy S24 Ultra 512GB', price: 145000, priceLabel: 'J$145,000', parish: 'Kingston', tier: 'FREE' as ListingTier, fields: [{ key:'brand',label:'Brand',value:'Samsung' },{ key:'model',label:'Model',value:'Galaxy S24 Ultra' },{ key:'storage',label:'Storage',value:'512GB' },{ key:'condition',label:'Condition',value:'Brand New' }], desc: 'Brand new Samsung Galaxy S24 Ultra, still sealed in box. Titanium Black colour. S Pen included. Purchased abroad, comes with international charger plus Jamaican adapter.' },
    { title: 'iPhone 13 128GB — Rose Gold', price: 85000, priceLabel: 'J$85,000', parish: 'St. Andrew', tier: 'FREE' as ListingTier, fields: [{ key:'brand',label:'Brand',value:'Apple' },{ key:'model',label:'Model',value:'iPhone 13' },{ key:'storage',label:'Storage',value:'128GB' },{ key:'condition',label:'Condition',value:'Used - Good' }], desc: 'iPhone 13 in Rose Gold. Battery health 84%, minor scuff on corner. All functions working perfectly. Unlocked to all networks. Comes with charger and silicone case.' },
    { title: 'Samsung A54 5G — Brand New Sealed', price: 62000, priceLabel: 'J$62,000', parish: 'St. James', tier: 'FREE' as ListingTier, fields: [{ key:'brand',label:'Brand',value:'Samsung' },{ key:'model',label:'Model',value:'Galaxy A54' },{ key:'storage',label:'Storage',value:'128GB' },{ key:'condition',label:'Condition',value:'Brand New' }], desc: 'Brand new Samsung A54 5G, sealed in box. Awesome Blue colour. 5000mAh battery, 50MP camera. JMD price, come view.' },
    { title: 'iPhone 14 Pro 256GB — Deep Purple', price: 120000, priceLabel: 'J$120,000', parish: 'Kingston', tier: 'PREMIUM' as ListingTier, fields: [{ key:'brand',label:'Brand',value:'Apple' },{ key:'model',label:'Model',value:'iPhone 14 Pro' },{ key:'storage',label:'Storage',value:'256GB' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: 'iPhone 14 Pro in stunning Deep Purple. Battery health 91%, Dynamic Island, always-on display. With original box and accessories. Unlocked, works on all Jamaican networks.' },
    { title: 'Google Pixel 8 Pro 128GB', price: 95000, priceLabel: 'J$95,000', parish: 'St. Andrew', tier: 'FREE' as ListingTier, fields: [{ key:'brand',label:'Brand',value:'Google' },{ key:'model',label:'Model',value:'Pixel 8 Pro' },{ key:'storage',label:'Storage',value:'128GB' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: 'Google Pixel 8 Pro with incredible camera system. Temperature sensor, 7 years of OS updates. Porcelain colour, minor wear on back glass. Great condition overall.' },
    { title: 'iPad Pro 12.9" M2 256GB WiFi', price: 155000, priceLabel: 'J$155,000', parish: 'Manchester', tier: 'PREMIUM' as ListingTier, fields: [{ key:'brand',label:'Brand',value:'Apple' },{ key:'model',label:'Model',value:'iPad Pro 12.9"' },{ key:'storage',label:'Storage',value:'256GB' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: 'iPad Pro 12.9 inch M2 chip, WiFi only. With smart folio case and Apple Pencil 2nd gen. Used for design work, switching to studio monitor. Excellent condition.' },
    { title: 'Samsung Galaxy Z Fold 5', price: 220000, priceLabel: 'J$220,000', parish: 'Kingston', tier: 'PREMIUM' as ListingTier, fields: [{ key:'brand',label:'Brand',value:'Samsung' },{ key:'model',label:'Model',value:'Galaxy Z Fold 5' },{ key:'storage',label:'Storage',value:'256GB' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: 'Rare Samsung Galaxy Z Fold 5 in Icy Blue. Barely used, with S Pen case and original box. The ultimate productivity phone. Hinge in perfect condition, no creases on inner display.' },
    { title: 'iPhone 12 Mini 64GB — Black', price: 55000, priceLabel: 'J$55,000', parish: 'St. Thomas', tier: 'FREE' as ListingTier, fields: [{ key:'brand',label:'Brand',value:'Apple' },{ key:'model',label:'Model',value:'iPhone 12 Mini' },{ key:'storage',label:'Storage',value:'64GB' },{ key:'condition',label:'Condition',value:'Used - Good' }], desc: 'Compact iPhone 12 Mini, perfect for those who prefer smaller phones. Battery health 79%, screen has minor scratches. Body in good shape. Unlocked.' },
    { title: 'Xiaomi Redmi Note 13 Pro', price: 48000, priceLabel: 'J$48,000', parish: 'St. Catherine', tier: 'FREE' as ListingTier, fields: [{ key:'brand',label:'Brand',value:'Xiaomi' },{ key:'model',label:'Model',value:'Redmi Note 13 Pro' },{ key:'storage',label:'Storage',value:'256GB' },{ key:'condition',label:'Condition',value:'Brand New' }], desc: 'Brand new Xiaomi Redmi Note 13 Pro. 200MP camera, 120Hz AMOLED display, 67W fast charging. Midnight Black. Great value flagship killer.' },
  ]

  for (let i = 0; i < mobileListings.length; i++) {
    const l = mobileListings[i]
    const seller = sellers[i % sellers.length]
    await createListing({ title: l.title, description: l.desc, price: l.price, priceLabel: l.priceLabel, parish: l.parish, categorySlug: 'mobile-devices', userId: seller.id, tier: l.tier, contactName: seller.name!, contactPhone: seller.phone!, contactEmail: seller.email, createdDaysAgo: i, fields: l.fields })
  }
  console.log(`  ✓ ${mobileListings.length} mobile listings`)

  // ══════════════════════════════════════════
  // JOBS — 10 listings
  // ══════════════════════════════════════════
  console.log('💼 Seeding Jobs...')
  const jobListings = [
    { title: 'Accountant — Kingston Financial Firm', priceLabel: 'Salary: Negotiable', parish: 'Kingston', fields: [{ key:'job_type',label:'Job Type',value:'Full-time' },{ key:'industry',label:'Industry',value:'Finance' },{ key:'experience',label:'Experience',value:'2+ years' }], desc: 'Growing financial services firm seeks qualified Accountant. ACCA or degree in Accounting required. Responsibilities include financial reporting, tax filings and payroll. Competitive salary and benefits package.' },
    { title: 'Software Developer — React/Node.js', priceLabel: 'J$350,000–450,000/mo', parish: 'Kingston', fields: [{ key:'job_type',label:'Job Type',value:'Full-time' },{ key:'industry',label:'Industry',value:'IT & Technology' },{ key:'experience',label:'Experience',value:'3+ years' }], desc: 'Tech startup looking for experienced full-stack developer. Must know React, Node.js, PostgreSQL. Remote-friendly, flexible hours. Equity options available. Help us build the future of Jamaican fintech.' },
    { title: 'Registered Nurse — Private Hospital', priceLabel: 'J$180,000–220,000/mo', parish: 'St. Andrew', fields: [{ key:'job_type',label:'Job Type',value:'Full-time' },{ key:'industry',label:'Industry',value:'Healthcare' },{ key:'experience',label:'Experience',value:'1+ years' }], desc: 'Private medical facility seeks registered nurses for ward and ICU positions. Current RN licence required. Shift work, excellent benefits including health insurance and pension. Night differential paid.' },
    { title: 'Primary School Teacher — Mathematics', priceLabel: 'Salary: Per MOE Scale', parish: 'St. Catherine', fields: [{ key:'job_type',label:'Job Type',value:'Full-time' },{ key:'industry',label:'Industry',value:'Education' },{ key:'experience',label:'Experience',value:'1+ years' }], desc: 'Established primary school in Portmore seeks qualified Mathematics teacher. B.Ed or equivalent required. Passionate educators encouraged to apply. Supportive environment with professional development opportunities.' },
    { title: 'Hotel Front Desk Supervisor — Ocho Rios', priceLabel: 'J$120,000–150,000/mo', parish: 'St. Ann', fields: [{ key:'job_type',label:'Job Type',value:'Full-time' },{ key:'industry',label:'Industry',value:'Hospitality & Tourism' },{ key:'experience',label:'Experience',value:'2+ years' }], desc: '4-star resort seeks experienced Front Desk Supervisor. Must have hotel management experience, excellent communication skills and Opera PMS knowledge. Accommodation and meals included.' },
    { title: 'Construction Foreman — Major Project', priceLabel: 'J$160,000/mo', parish: 'St. Catherine', fields: [{ key:'job_type',label:'Job Type',value:'Contract' },{ key:'industry',label:'Industry',value:'Construction' },{ key:'experience',label:'Experience',value:'5+ years' }], desc: 'Large construction company needs experienced foreman for residential development in Portmore. 18-month contract, potential for permanent. Must have NVQ Level 3 or equivalent and proven team leadership.' },
    { title: 'Executive Assistant — CEO Office', priceLabel: 'J$200,000/mo', parish: 'Kingston', fields: [{ key:'job_type',label:'Job Type',value:'Full-time' },{ key:'industry',label:'Industry',value:'Administration' },{ key:'experience',label:'Experience',value:'3+ years' }], desc: 'Professional services firm requires polished Executive Assistant for CEO. Diary management, travel coordination, board meeting minutes, correspondence. Must be discreet, proactive and highly organised.' },
    { title: 'Sales Representative — FMCG', priceLabel: 'Base + Commission', parish: 'Kingston', fields: [{ key:'job_type',label:'Job Type',value:'Full-time' },{ key:'industry',label:'Industry',value:'Sales & Marketing' },{ key:'experience',label:'Experience',value:'1+ years' }], desc: 'Leading consumer goods distributor seeks Sales Reps for Kingston and St Andrew. Company vehicle, phone and laptop provided. Target-driven role with uncapped commission. Previous FMCG sales experience preferred.' },
    { title: 'Graphic Designer — Marketing Agency', priceLabel: 'J$120,000–160,000/mo', parish: 'Kingston', fields: [{ key:'job_type',label:'Job Type',value:'Full-time' },{ key:'industry',label:'Industry',value:'Sales & Marketing' },{ key:'experience',label:'Experience',value:'2+ years' }], desc: 'Creative agency seeks talented Graphic Designer. Proficiency in Adobe Creative Suite required. Will work on branding, social media, print and digital campaigns. Portfolio must be submitted with application.' },
    { title: 'Security Officer — Corporate Building', priceLabel: 'J$80,000/mo', parish: 'Kingston', fields: [{ key:'job_type',label:'Job Type',value:'Full-time' },{ key:'industry',label:'Industry',value:'Administration' },{ key:'experience',label:'Experience',value:'1+ years' }], desc: 'Corporate security firm seeks licensed security officers for New Kingston office building. Day and night shifts available. Must have valid firearm licence. Uniform provided. Punctual and professional candidates only.' },
  ]

  for (let i = 0; i < jobListings.length; i++) {
    const l = jobListings[i]
    const seller = sellers[i % sellers.length]
    await createListing({ title: l.title, description: l.desc, price: null, priceLabel: l.priceLabel, parish: l.parish, categorySlug: 'jobs', userId: seller.id, tier: i % 3 === 0 ? 'PREMIUM' : 'FREE', contactName: seller.name!, contactPhone: seller.phone!, contactEmail: seller.email, createdDaysAgo: i, fields: l.fields })
  }
  console.log(`  ✓ ${jobListings.length} job listings`)

  // ══════════════════════════════════════════
  // COMPUTERS — 8 listings
  // ══════════════════════════════════════════
  console.log('💻 Seeding Computers...')
  const computerListings = [
    { title: 'MacBook Air M2 2023 — 16GB RAM 512GB', price: 220000, priceLabel: 'J$220,000', parish: 'Kingston', tier: 'PREMIUM' as ListingTier, fields: [{ key:'type',label:'Type',value:'Laptop' },{ key:'brand',label:'Brand',value:'Apple' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: 'MacBook Air M2 Midnight colour. 16GB unified memory, 512GB SSD. Battery cycle count 89. AppleCare+ coverage until 2025. Complete with original charger and box.' },
    { title: 'Dell XPS 15 — Intel i7, RTX 3050', price: 185000, priceLabel: 'J$185,000', parish: 'St. Andrew', tier: 'FREE' as ListingTier, fields: [{ key:'type',label:'Type',value:'Laptop' },{ key:'brand',label:'Brand',value:'Dell' },{ key:'condition',label:'Condition',value:'Used - Good' }], desc: 'Dell XPS 15 with 4K OLED display. Intel Core i7-12700H, 32GB RAM, 1TB SSD, RTX 3050. Perfect for video editing and creative work. Minor keyboard wear, everything functions perfectly.' },
    { title: 'Gaming PC — RTX 3080, Ryzen 9', price: 350000, priceLabel: 'J$350,000', parish: 'Kingston', tier: 'PREMIUM' as ListingTier, fields: [{ key:'type',label:'Type',value:'Desktop' },{ key:'brand',label:'Brand',value:'Custom Build' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: 'High-end gaming PC build. AMD Ryzen 9 5900X, RTX 3080 10GB, 32GB DDR4 3600MHz, 2TB NVMe SSD. Corsair 4000D case with RGB. Runs everything on max settings.' },
    { title: 'HP Pavilion Laptop 15 — Core i5', price: 95000, priceLabel: 'J$95,000', parish: 'St. Catherine', tier: 'FREE' as ListingTier, fields: [{ key:'type',label:'Type',value:'Laptop' },{ key:'brand',label:'Brand',value:'HP' },{ key:'condition',label:'Condition',value:'Used - Good' }], desc: 'HP Pavilion 15 inch, Intel Core i5 11th gen, 8GB RAM, 256GB SSD. Windows 11, full HD display. Good battery life. Some scuffs on the lid but screen is perfect.' },
    { title: 'iPad Air 5th Gen — 64GB WiFi', price: 75000, priceLabel: 'J$75,000', parish: 'St. James', tier: 'FREE' as ListingTier, fields: [{ key:'type',label:'Type',value:'Tablet' },{ key:'brand',label:'Brand',value:'Apple' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: 'iPad Air 5th generation with M1 chip. 64GB WiFi in Starlight. Smart Folio case included. No scratches on screen, minor wear on back. Great for students.' },
    { title: 'ASUS ROG Strix G15 Gaming Laptop', price: 280000, priceLabel: 'J$280,000', parish: 'Kingston', tier: 'PREMIUM' as ListingTier, fields: [{ key:'type',label:'Type',value:'Laptop' },{ key:'brand',label:'Brand',value:'ASUS' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: 'ASUS ROG Strix G15 gaming laptop. Ryzen 9 6900HX, RX 6800M 12GB, 16GB RAM, 1TB NVMe. 300Hz FHD display, full RGB keyboard. Runs AAA titles flawlessly.' },
    { title: 'Samsung 27" 4K Monitor', price: 55000, priceLabel: 'J$55,000', parish: 'St. Andrew', tier: 'FREE' as ListingTier, fields: [{ key:'type',label:'Type',value:'Monitor' },{ key:'brand',label:'Brand',value:'Samsung' },{ key:'condition',label:'Condition',value:'Used - Excellent' }], desc: 'Samsung 27 inch 4K UHD monitor. IPS panel, 60Hz, USB-C connectivity. Perfect for home office or creative work. No dead pixels, original stand and cables included.' },
    { title: 'Lenovo ThinkPad X1 Carbon', price: 160000, priceLabel: 'J$160,000', parish: 'Kingston', tier: 'FREE' as ListingTier, fields: [{ key:'type',label:'Type',value:'Laptop' },{ key:'brand',label:'Brand',value:'Lenovo' },{ key:'condition',label:'Condition',value:'Used - Good' }], desc: 'Business-class Lenovo ThinkPad X1 Carbon Gen 9. Core i7-1165G7, 16GB RAM, 512GB SSD. Featherlight, excellent keyboard, fingerprint reader. Perfect for executives and road warriors.' },
  ]

  for (let i = 0; i < computerListings.length; i++) {
    const l = computerListings[i]
    const seller = sellers[i % sellers.length]
    await createListing({ title: l.title, description: l.desc, price: l.price, priceLabel: l.priceLabel, parish: l.parish, categorySlug: 'computers', userId: seller.id, tier: l.tier, contactName: seller.name!, contactPhone: seller.phone!, contactEmail: seller.email, createdDaysAgo: i, fields: l.fields })
  }
  console.log(`  ✓ ${computerListings.length} computer listings`)

  // ══════════════════════════════════════════
  // REMAINING CATEGORIES — quick batch
  // ══════════════════════════════════════════
  console.log('📦 Seeding remaining categories...')

  const quickListings = [
    // Furniture
    { title: 'Living Room Sofa Set — 3+2+1', price: 85000, priceLabel: 'J$85,000', parish: 'Kingston', slug: 'furniture', desc: '3 piece sofa set in grey fabric. Excellent condition, barely used. Moving sale, must go quickly. Available for viewing in Kingston.' },
    { title: 'Queen Bed Frame with Mattress', price: 55000, priceLabel: 'J$55,000', parish: 'St. Andrew', slug: 'furniture', desc: 'Solid wood queen bed frame with Sealy pillow top mattress. 2 years old, no stains. Comes with bed frame, mattress and 2 bedside tables.' },
    { title: 'Dining Table — 6 Seater Glass Top', price: 45000, priceLabel: 'J$45,000', parish: 'St. Catherine', slug: 'furniture', desc: 'Glass top dining table with 6 chairs. Chrome legs, grey fabric chairs. Selling due to renovation. Pickup only, available weekends.' },
    { title: 'Office Desk & Chair — Work from Home', price: 28000, priceLabel: 'J$28,000', parish: 'Kingston', slug: 'furniture', desc: 'L-shaped office desk with ergonomic chair. Desk has cable management, multiple USB ports. Chair is mesh back with lumbar support. 1 year old, great condition.' },
    // Appliances
    { title: 'Samsung French Door Refrigerator 28 cu ft', price: 185000, priceLabel: 'J$185,000', parish: 'Kingston', slug: 'appliances', desc: 'Samsung 28 cubic foot French door refrigerator in stainless steel. Ice maker, water dispenser, twin cooling. 3 years old, works perfectly. Delivery can be arranged.' },
    { title: 'LG 8kg Front Load Washing Machine', price: 68000, priceLabel: 'J$68,000', parish: 'St. Catherine', slug: 'appliances', desc: 'LG 8kg front loader with steam function. All cycles working. Minor marks on door, drum immaculate. Selling as upgrading to bigger capacity.' },
    { title: 'Midea 1.5HP Split Unit Air Conditioner', price: 75000, priceLabel: 'J$75,000', parish: 'St. Andrew', slug: 'appliances', desc: 'Midea 1.5HP inverter split unit, 1 year old. Energy efficient, remote control, WiFi enabled. Installation screws and brackets included. Ideal for medium bedroom.' },
    { title: 'Stove — Gas Range 4 Burner', price: 42000, priceLabel: 'J$42,000', parish: 'Manchester', slug: 'appliances', desc: '4 burner gas range with oven. Auto ignition, oven light, grill function. 2 years old, clean and well maintained. Selling because moving to electric. Works perfectly.' },
    // Pets
    { title: 'Golden Retriever Puppies — Vaccinated', price: 45000, priceLabel: 'J$45,000 each', parish: 'St. Ann', slug: 'pets-animals', desc: 'AKC-line Golden Retriever puppies, 8 weeks old. Both parents on site. 1st vaccination done, dewormed. 3 males, 2 females available. Serious buyers only.' },
    { title: 'Rottweiler Pups — 6 weeks', price: 35000, priceLabel: 'J$35,000 each', parish: 'Kingston', slug: 'pets-animals', desc: 'Pure bred Rottweiler puppies. Father is German imported, mother Jamaican bred. Big boned, great temperament. Will be ready for new home at 8 weeks. Deposit to reserve.' },
    { title: 'Aquarium Setup — 55 Gallon', price: 22000, priceLabel: 'J$22,000', parish: 'St. Andrew', slug: 'pets-animals', desc: 'Complete 55 gallon freshwater aquarium setup. Tank, stand, filter, heater, lighting and decorations included. 20 community fish also available if wanted. Changing hobby.' },
    // Clothing
    { title: 'Nike Air Jordan 4 Retro — Size 10 US', price: 32000, priceLabel: 'J$32,000', parish: 'Kingston', slug: 'clothing-accessories', desc: 'Jordan 4 Retro in Black Cat colourway. Size 10 US, worn once. Deadstock condition, original box included. No lowballers, price is firm.' },
    { title: "Women's Designer Handbag Collection", price: 85000, priceLabel: 'From J$15,000 each', parish: 'St. Andrew', slug: 'clothing-accessories', desc: 'Selling collection of 6 designer-inspired handbags. Coach, Michael Kors and Kate Spade styles. Various colours. All in great condition, perfect for the office or going out.' },
    { title: 'School Uniforms — Various Sizes', price: 3500, priceLabel: 'From J$3,500', parish: 'St. Catherine', slug: 'clothing-accessories', desc: 'Selling collection of gently used school uniforms from various Kingston schools. Sizes 6-14 years. Includes shirts, pants, skirts and tunics. WhatsApp for full list and sizes.' },
    // Sports
    { title: 'Home Gym Package — Full Set', price: 120000, priceLabel: 'J$120,000', parish: 'Kingston', slug: 'sports-fitness', desc: 'Complete home gym setup. Olympic barbell and 200lbs of plates, adjustable dumbbells 5-50lbs, pull-up station, bench press. 1 year old, moving abroad. Package deal only.' },
    { title: 'Trek Mountain Bike 29" — 21 Speed', price: 65000, priceLabel: 'J$65,000', parish: 'St. Andrew', slug: 'sports-fitness', desc: 'Trek Marlin 6 mountain bike, 29 inch wheels, 21 speed Shimano gears. Hydraulic disc brakes, suspension fork. Ridden on Blue Mountain trail 5 times. Excellent shape.' },
    // Services
    { title: 'Professional Photography — Events & Portraits', price: 25000, priceLabel: 'From J$25,000', parish: 'Kingston', slug: 'services', desc: 'Professional photographer available for weddings, graduations, corporate events and portraits. Canon R6 Mark II, professional lighting. Edited photos delivered within 5 business days. Portfolio available.' },
    { title: 'Plumbing Services — Licensed & Insured', price: 5000, priceLabel: 'From J$5,000', parish: 'St. Andrew', slug: 'services', desc: 'Licensed plumber with 15 years experience. Specialising in leak repairs, pipe installation, bathroom renovations and water tank installation. Available 7 days a week including emergencies.' },
    { title: 'Private Maths Tutor — CXC & CAPE', price: 3500, priceLabel: 'J$3,500/hr', parish: 'Kingston', slug: 'services', desc: 'UWI Mathematics graduate offering private tuition for CXC and CAPE students. 8 years experience, excellent past paper record. Online or in-person sessions available. Weekend slots open.' },
    // Games
    { title: 'PlayStation 5 Console — Disc Version', price: 95000, priceLabel: 'J$95,000', parish: 'Kingston', slug: 'games', desc: 'PS5 disc edition with 2 controllers and 4 games (FIFA 24, Spider-Man 2, God of War Ragnarok, Call of Duty). Everything in perfect working order. Selling to fund PC build.' },
    { title: 'Nintendo Switch OLED — White', price: 65000, priceLabel: 'J$65,000', parish: 'St. Andrew', slug: 'games', desc: 'Nintendo Switch OLED model in white. Includes dock, Joy-Cons and Mario Kart 8 Deluxe. Screen has no scratches. Barely used, adult owner. Great family gift.' },
    // Jewelry
    { title: '14k Gold Cuban Link Chain — 24 inch', price: 95000, priceLabel: 'J$95,000', parish: 'Kingston', slug: 'jewelry', desc: '14 karat solid gold Cuban link chain, 24 inches, 8mm width. Has purity stamp, purchased from reputable jeweler. Receipt available. Will pass acid test.' },
    { title: 'Diamond Engagement Ring — 0.75ct', price: 180000, priceLabel: 'J$180,000', parish: 'St. Andrew', slug: 'jewelry', desc: '18k white gold diamond solitaire engagement ring. 0.75ct round brilliant, VS2 clarity, G colour. Certificate of authenticity included. Selling after cancelled engagement.' },
    // Baby
    { title: 'Baby Stroller — Graco FastAction', price: 18000, priceLabel: 'J$18,000', parish: 'St. Catherine', slug: 'baby', desc: 'Graco FastAction fold stroller, one hand fold, reclines fully. Good condition, clean fabric, no rips. Baby grew out of it. Comes with rain cover.' },
    { title: 'Baby Crib & Mattress — Convertible', price: 25000, priceLabel: 'J$25,000', parish: 'Kingston', slug: 'baby', desc: 'Convertible 4-in-1 baby crib. Converts from crib to toddler bed, daybed and full-size headboard. Solid pine wood, non-toxic finish. Mattress included.' },
    // Cosmetics
    { title: 'MAC Cosmetics Collection — 30+ items', price: 15000, priceLabel: 'J$15,000 for all', parish: 'Kingston', slug: 'cosmetics', desc: 'Large MAC cosmetics collection including 12 lipsticks, 8 eyeshadow palettes, foundation, blush and brushes. All lightly used, sanitised. Photos available on request.' },
    // Food & Beverages
    { title: 'Catering Service — Jamaican Cuisine', price: 3500, priceLabel: 'From J$3,500/head', parish: 'Kingston', slug: 'food-beverages', desc: 'Professional catering service specialising in authentic Jamaican cuisine. Jerk, curry goat, oxtail, rice and peas, festival and more. Corporate events, parties, funerals. Minimum 20 persons.' },
    // Media
    { title: 'Acoustic Guitar — Yamaha F310', price: 22000, priceLabel: 'J$22,000', parish: 'St. Andrew', slug: 'media-entertainment', desc: 'Yamaha F310 acoustic guitar in good condition. Comes with soft gig bag, spare strings and picks. Small ding on the body but plays and sounds great. Ideal for beginner.' },
  ]

  let quickCount = 0
  for (let i = 0; i < quickListings.length; i++) {
    const l = quickListings[i]
    const seller = sellers[i % sellers.length]
    await createListing({ title: l.title, description: l.desc, price: l.price, priceLabel: l.priceLabel, parish: l.parish, categorySlug: l.slug, userId: seller.id, contactName: seller.name!, contactPhone: seller.phone!, contactEmail: seller.email, createdDaysAgo: i })
    quickCount++
  }
  console.log(`  ✓ ${quickCount} listings across remaining categories`)

  // Summary
  const total = await prisma.listing.count()
  console.log(`\n🎉 Seed complete! ${total} total listings\n`)
  console.log('─────────────────────────────────────────')
  console.log('  Admin: admin@jamaicaclassifieds.com / admin123!')
  console.log('  User:  demo@example.com / user123!')
  console.log('─────────────────────────────────────────\n')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })

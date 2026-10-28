
(function(){
'use strict';

var FREE_ADS=3;
var PRODUCTS={monthly:{price:199,days:30,kind:'plan'},yearly:{price:1499,days:365,kind:'plan'},eliteBuyer:{price:149,days:30,kind:'eb'},eliteSeller:{price:399,days:30,kind:'es'}};

var CATS=[
 {id:'cycle',c:'#2F7D5B',n:{en:'Cycle',hi:'साइकिल',or:'ସାଇକେଲ୍'}},
 {id:'bike',c:'#C2410C',n:{en:'Bike',hi:'बाइक',or:'ବାଇକ୍'}},
 {id:'car',c:'#1D5FAE',n:{en:'Car',hi:'कार',or:'କାର୍'}},
 {id:'transport',c:'#7A4FA3',n:{en:'Transport',hi:'ट्रांसपोर्ट',or:'ଟ୍ରାନ୍ସପୋର୍ଟ'}},
 {id:'bus',c:'#B4232A',n:{en:'Bus',hi:'बस',or:'ବସ୍'}},
 {id:'earthmovers',c:'#A16207',n:{en:'Earthmovers',hi:'अर्थमूवर',or:'ଅର୍ଥମୁଭର୍'}}
];
var BRANDS={
 cycle:['Atlas','Avon','BSA','Firefox','Hercules','Hero','Montra','Ranger','Stryder'],
 bike:['Bajaj','Hero','Honda','KTM','Royal Enfield','Suzuki','TVS','Yamaha'],
 car:['Ford','Honda','Hyundai','Kia','Mahindra','Maruti Suzuki','Nissan','Renault','Skoda','Tata','Toyota','Volkswagen'],
 transport:['Ashok Leyland','BharatBenz','Eicher','Force','Isuzu','Mahindra','Piaggio','Tata'],
 bus:['Ashok Leyland','BharatBenz','Eicher','Force','Tata','Volvo'],
 earthmovers:['Caterpillar','Hitachi','JCB','Komatsu','L&T','Sany','Tata Hitachi','Volvo']
};
function brandsOf(cat){
  var hb=(S.hiddenBrands&&S.hiddenBrands[cat])||[];
  var l=(BRANDS[cat]||[]).concat((S.customBrands&&S.customBrands[cat])||[]).filter(function(b){return hb.indexOf(b)<0;});
  return l.sort(function(a,b){return a.localeCompare(b);});
}
function addBrand(cat,name){
  name=name.replace(/\s+/g,' ').trim().slice(0,30);
  var all=brandsOf(cat);
  for(var i=0;i<all.length;i++)if(all[i].toLowerCase()===name.toLowerCase())return all[i];
  S.customBrands=S.customBrands||{};
  (S.customBrands[cat]=S.customBrands[cat]||[]).push(name);
  persist();return name;
}
/* Vehicle pictures are drawn as inline SVG: white shapes on the category colour. */
var ICONS={"box": "<path d=\"M12 3l8 4.5v9L12 21l-8-4.5v-9z\"/><path d=\"M4 7.5l8 4.5 8-4.5M12 12v9\"/>", "wrench": "<path d=\"M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-.6-.6-2.6z\"/>", "gear": "<circle cx=\"12\" cy=\"12\" r=\"4\"/><circle cx=\"12\" cy=\"12\" r=\"7.5\"/><path d=\"M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8\"/>", "battery": "<rect x=\"3\" y=\"7\" width=\"16\" height=\"11\" rx=\"2\"/><path d=\"M21 11v3M7 12.5h4M9 10.5v4M15 12.5h2\"/>", "tyre": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"3.5\"/><path d=\"M12 3v5.5M12 15.5V21M3 12h5.5M15.5 12H21\"/>", "bolt": "<path d=\"M13 2L4 14h7l-1 8 9-12h-7z\"/>", "fuel": "<rect x=\"4\" y=\"3\" width=\"9\" height=\"18\" rx=\"1\"/><path d=\"M13 8h3l2 2v8a1.5 1.5 0 0 0 3 0v-8l-2-2M7 7h3\"/>", "light": "<path d=\"M4 8h8a6 6 0 0 1 0 8H4z\"/><path d=\"M16 9h5M16 12h5M16 15h5\"/>", "steering": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/><path d=\"M3 12h7M14 12h7M12 14v7\"/>", "key": "<circle cx=\"8\" cy=\"15\" r=\"4\"/><path d=\"M11 12l9-9M16 7l3 3M14 9l2 2\"/>", "engine": "<path d=\"M5 9h3V6h6v3h3l2 2v4l-2 2H5z\"/><path d=\"M3 12h2M9 13h6\"/>", "seat": "<path d=\"M7 3l-1.5 11H18v4H6\"/><path d=\"M5 18h14\"/>"};
var ICON_KEYS=Object.keys(ICONS);
function iconSvg(k){return'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[k]||ICONS.box)+'</svg>';}
function catById(id){for(var i=0;i<CATS.length;i++)if(CATS[i].id===id)return CATS[i];return null;}
function vsvg(id,c){
  var W='#fff',p='';
  if(String(id).indexOf('u_')===0){var ce=catById(id)||{};return ce.img?'<img class="clogo" alt="" src="'+esc(ce.img)+'">':iconSvg(ce.icon);}
  var wheel=function(x,y,r,sw){return'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'" stroke="'+W+'" stroke-width="'+(sw||4)+'"/><circle cx="'+x+'" cy="'+y+'" r="'+Math.max(2,Math.round(r/3))+'" fill="'+W+'"/>';};
  if(id==='cycle'){
    p='<g fill="none" stroke="'+W+'" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><circle cx="28" cy="54" r="17"/><circle cx="92" cy="54" r="17"/>'+
      '<path d="M28 54L50 30H84L58 54Z"/><path d="M84 30L92 54M84 30V21M77 21H92M44 25H58M50 30L58 54M52 58H64"/></g>'+
      '<circle cx="58" cy="54" r="4" fill="'+W+'"/>';
  }else if(id==='bike'){
    p='<g fill="none" stroke="'+W+'" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><circle cx="26" cy="56" r="15"/><circle cx="96" cy="56" r="15"/>'+
      '<path d="M88 26L96 56M80 24H94M30 56L48 42H68L86 56"/></g>'+
      '<path d="M48 42Q58 26 76 33L72 46L48 48Z" fill="'+W+'"/><path d="M30 40H52L50 46H34Z" fill="'+W+'"/><rect x="54" y="48" width="18" height="10" rx="2" fill="'+W+'"/>'+
      '<path d="M26 56L12 60" stroke="'+W+'" stroke-width="4" stroke-linecap="round"/>';
  }else if(id==='car'){
    p='<path d="M10 56V46Q10 41 16 39L32 36L43 21Q45 19 49 19H78Q82 19 85 23L95 37L106 40Q112 42 112 48V56Z" fill="'+W+'"/>'+
      '<path d="M38 36L47 25H61V36Z" fill="'+c+'"/><path d="M66 25H77L86 36H66Z" fill="'+c+'"/>'+wheel(32,58,11)+wheel(90,58,11);
  }else if(id==='transport'){
    p='<rect x="6" y="16" width="64" height="40" rx="3" fill="'+W+'"/><path d="M74 28H96L112 43V56H74Z" fill="'+W+'"/>'+
      '<path d="M80 33H94L103 43H80Z" fill="'+c+'"/><path d="M13 36H63" stroke="'+c+'" stroke-width="3" opacity=".45"/>'+wheel(26,58,9)+wheel(52,58,9)+wheel(94,58,9);
  }else if(id==='bus'){
    p='<rect x="5" y="12" width="110" height="44" rx="9" fill="'+W+'"/>'+
      '<rect x="11" y="20" width="17" height="15" rx="2" fill="'+c+'"/><rect x="32" y="20" width="17" height="15" rx="2" fill="'+c+'"/><rect x="53" y="20" width="17" height="15" rx="2" fill="'+c+'"/><rect x="74" y="20" width="17" height="15" rx="2" fill="'+c+'"/><rect x="95" y="20" width="15" height="15" rx="2" fill="'+c+'"/>'+
      '<path d="M5 44H115" stroke="'+c+'" stroke-width="3" opacity=".45"/>'+wheel(28,58,9)+wheel(90,58,9);
  }else{
    p='<rect x="14" y="56" width="68" height="17" rx="8.500" fill="'+W+'"/><circle cx="26" cy="64.500" r="4" fill="'+c+'"/><circle cx="48" cy="64.500" r="4" fill="'+c+'"/><circle cx="70" cy="64.500" r="4" fill="'+c+'"/>'+
      '<rect x="20" y="34" width="46" height="24" rx="3" fill="'+W+'"/><rect x="38" y="38" width="22" height="13" rx="2" fill="'+c+'"/>'+
      '<path d="M62 42L90 14L103 44" fill="none" stroke="'+W+'" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'+
      '<path d="M96 42H114L108 58L94 55Z" fill="'+W+'"/>';
  }
  return'<svg viewBox="0 0 120 80" aria-hidden="true" focusable="false">'+p+'</svg>';
}

var SAMPLES=[
 {cat:'car',brand:'Hyundai',t:'Hyundai i10 doors and bonnet',p:3200,u:'piece',q:4,city:'Mumbai',d:'Doors and bonnet from an accident car. Colour silver.',seller:'Sample Auto Scrap',days:1},
 {cat:'bike',brand:'Honda',t:'Honda Activa engine and body parts',p:5200,u:'piece',q:2,city:'Delhi',d:'Engine runs. Body panels also available.',seller:'Sample Bike Yard',days:2},
 {cat:'transport',brand:'Mahindra',t:'Mahindra Bolero pickup chassis',p:22000,u:'piece',q:1,city:'Lucknow',d:'Chassis with papers. Pickup from yard.',seller:'Sample Transport Scrap',days:4},
 {cat:'car',brand:'Toyota',t:'Toyota Innova AC compressor and radiator',p:6500,u:'piece',q:3,city:'Bengaluru',d:'Working AC compressor and radiator set.',seller:'Sample Auto Scrap',days:3},
 {cat:'earthmovers',brand:'Tata Hitachi',t:'Tata Hitachi excavator track chain',p:60000,u:'piece',q:1,city:'Kolkata',d:'Track chain and rollers from an old excavator.',seller:'Sample Heavy Scrap',days:6},
 {cat:'bus',brand:'Eicher',t:'Eicher bus engine and radiator',p:48000,u:'piece',q:1,city:'Chennai',d:'Engine with radiator, from a scrapped bus.',seller:'Sample Bus Yard',days:5},
 {cat:'cycle',brand:'Hero',t:'Hero Sprint cycle parts, mixed lot',p:200,u:'piece',q:30,city:'Ludhiana',d:'Mixed lot of frames, wheels and chains.',seller:'Sample Cycle Mart',days:2},
 {cat:'bike',brand:'Royal Enfield',t:'Royal Enfield Bullet petrol tank and engine',p:11000,u:'piece',q:1,city:'Hyderabad',d:'Standard 350 tank and engine block.',seller:'Sample Bike Yard',days:7},
 {cat:'car',brand:'Maruti Suzuki',t:'Maruti 800 engine and gearbox',p:9000,u:'piece',q:1,city:'Bhubaneswar',d:'Taken from a scrapped Maruti 800. Engine turns by hand. Pickup from our yard.',seller:'Sample Auto Scrap',days:0,feat:true},
 {cat:'bike',brand:'Hero',t:'Hero Splendor engine, good condition',p:4500,u:'piece',q:1,city:'Cuttack',d:'Engine from a scrapped Splendor. Papers of the bike available.',seller:'Sample Bike Yard',days:1},
 {cat:'cycle',brand:'Hero',t:'Hero cycle frames and wheels, lot of 10',p:350,u:'piece',q:10,city:'Pune',d:'Frames with wheels. Sold per piece, minimum 5.',seller:'Sample Cycle Mart',days:2},
 {cat:'transport',brand:'Tata',t:'Tata 407 gearbox and rear axle',p:18000,u:'piece',q:1,city:'Jaipur',d:'Gearbox and rear axle from a scrapped tempo.',seller:'Sample Transport Scrap',days:3},
 {cat:'cycle',brand:'Atlas',t:'Atlas cycle wheels and handles',p:250,u:'piece',q:15,city:'Jaipur',d:'Wheel pairs and handlebars. Some rust.',seller:'Sample Cycle Mart',days:3},
 {cat:'bus',brand:'Ashok Leyland',t:'Ashok Leyland bus seats, set of 20',p:600,u:'piece',q:20,city:'Bhubaneswar',d:'Passenger seats removed from an old school bus.',seller:'Sample Bus Yard',days:4},
 {cat:'earthmovers',brand:'JCB',t:'JCB backhoe hydraulic arm',p:45000,u:'piece',q:1,city:'Cuttack',d:'Arm and bucket from an old backhoe loader.',seller:'Sample Heavy Scrap',days:5},
 {cat:'bike',brand:'Bajaj',t:'Bajaj Pulsar engine, seized',p:3500,u:'piece',q:1,city:'Jaipur',d:'Engine seized. Good for spare parts.',seller:'Sample Bike Yard',days:8},
 {cat:'cycle',brand:'Avon',t:'Avon cycle seats and chains, 50 pieces',p:120,u:'piece',q:50,city:'Pune',d:'Mixed seats and chains. Sold as a lot or per piece.',seller:'Sample Cycle Mart',days:9}
];

var T={
en:{
 appName:'Kabadiwala.com',tagline:'Buy and sell scrap vehicle parts near you.',
 login:'Log in',signup:'Sign up',phone:'Mobile number',password:'Password',ownerName:'Your name',shopName:'Shop name',city:'City',
 createAccount:'Create account',demo:'Try a demo shop',logout:'Log out',or:'or',
 errPhone:'Enter a 10-digit mobile number.',errPass:'Password needs at least 6 characters.',errName:'Enter your name and shop name.',
 errNoUser:'No account with this number. Sign up first.',errWrongPass:'Wrong password.',errExists:'This number already has an account. Log in instead.',
 searchPh:'Search parts, e.g. bike engine',all:'All',cats:'Categories',fresh:'Fresh listings',nothing:'No listings found',nothingHint:'Try another category or search word.',
 sortNew:'Newest',sortLow:'Price: low to high',sortHigh:'Price: high to low',
 featured:'Featured',sold:'Sold',today:'Today',yesterday:'Yesterday',daysAgo:'days ago',
 sampleNote:'Listings marked Sample are examples to show how the app looks.',
 details:'Details',category:'Category',qty:'Quantity',posted:'Posted',location:'Location',desc:'Description',seller:'Seller',
 contact:'Contact seller',callNo:'Mobile number',copyNo:'Copy number',copied:'Number copied.',copyManual:'Select the number to copy it.',
 save:'Save',saved:'Saved',unsave:'Remove from saved',back:'Back',
 sell:'Sell',navHome:'Home',navSaved:'Saved',navAds:'My ads',navAccount:'Account',
 postAd:'Post a listing',editAd:'Edit listing',adTitle:'Title',adTitleEx:'e.g. Hero Splendor engine',adCat:'Category',adPrice:'Price (₹)',adUnit:'Per',
 kg:'kg',piece:'piece',quintal:'quintal',adQty:'Quantity available',adDesc:'Description',adCity:'City',adPhoto:'Photo',adPhotoHint:'A clear photo gets more calls.',
 removePhoto:'Remove photo',publish:'Publish listing',saveChanges:'Save changes',cancel:'Cancel',
 useMyLoc:'Use my current location',locFinding:'Finding your location...',locSet:'Location set:',locApprox:'Approximate location set:',locDenied:'Location permission was denied. Choose a state below.',locFail:'Could not find your location. Choose a state below.',locUnavail:'This device cannot share its location.',locNotIndia:'Your location is outside India. Choose a state below.',allIndia:'All India',chooseLoc:'Choose location',searchLoc:'Search state or city',allOf:'All of',statesH:'States and union territories',citiesH:'Cities',selState:'Select state',allStates:'All states',errAd:'Enter a title, a price above 0, a state and a city.',published:'Listing published.',updated:'Listing updated.',deleted:'Listing deleted.',
 limitMsg:'Free plan allows 3 live listings. Subscribe to post more.',viewPlans:'See plans',
 myAds:'My listings',noAds:'You have no listings yet.',markSold:'Mark sold',markLive:'Mark live',edit:'Edit',del:'Delete',confirmDel:'Tap again to delete',
 noSaved:'Nothing saved yet',noSavedHint:'Tap the heart on a listing to keep it here.',
 plans:'Plans',free:'Free',monthly:'Monthly',yearly:'Yearly',perMonth:'/month',perYear:'/year',eq:'About ₹125 a month',save37:'Save 37%',
 f_ads3:'Up to 3 live listings',f_unlimited:'Unlimited live listings',f_featured:'Featured badge on listings',f_photo:'Photo on every listing',
 current:'Current plan',choose:'Choose',validTill:'Valid till',expired:'Expired',
 payRzp:'Pay securely with Razorpay',payRzpSub:'UPI, cards, net banking and wallets open in the Razorpay checkout.',rzpFail:'Payment was not completed. You have not been charged for this order.',rzpLoad:'Could not open Razorpay. Check your internet and try again.',payVerifyFail:'The payment could not be verified. If money was deducted it will be refunded.',payMethod:'Choose a payment method',pmUpi:'UPI',pmUpiSub:'Google Pay, PhonePe, Paytm, BHIM',pmCard:'Credit or debit card',pmCardSub:'Visa, Mastercard, RuPay, Amex',pmNet:'Net banking',pmNetSub:'All major Indian banks',pmWallet:'Wallets',pmWalletSub:'Paytm, PhonePe, Amazon Pay and more',cardNo:'Card number',cardName:'Name on card',cardNameHint:'As printed on the card',cardExp:'Expiry',cardCvv:'CVV',pickBank:'Select your bank',errCard:'Enter a valid card number.',errCardName:'Enter the name on the card.',errExp:'Enter a valid expiry date as MM/YY.',errCvv:'Enter the 3 digit CVV (4 digits for Amex).',errBank:'Select your bank.',errWallet:'Select a wallet.',paidVia:'Paid via',payDemoSafe:'Demo payment. No money is charged and card details are never saved.',payTitle:'Payment',upiId:'UPI ID',errUpi:'Enter a valid UPI ID like name@bank.',payNow:'Pay',processing:'Processing payment…',
 paid:'Payment done. Plan is active.',demoNote:'Demo payment. No money is charged. Do not enter real card, UPI or bank details.',
 summary:'Order summary',total:'Total',
 account:'Account',language:'Language',owner:'Owner',shop:'Shop',localNote:'Demo version: data is saved on this phone only.',
 liveCount:'live',of:'of',
 myAccount:'My account',viewEdit:'View and edit profile',editProfile:'Edit profile',memberSince:'Member since',noAbout:'No description added yet.',message:'Message',call:'Call',
 basicInfo:'Basic information',selectPic:'Select profile picture',enterName:'Enter your name',yourName:'Your name',aboutYou:'Something about you',aboutPh:'Write a few lines about you and your shop',
 contactInfo:'Contact information',countryCode:'Country code',mobileNo:'Mobile number',enterMobile:'Enter mobile number',emailId:'Email ID',enterEmail:'Enter email ID (optional)',
 mobileVerified:'Mobile number is verified',emailVerified:'Email ID is verified',notVerified:'Not verified. Tap to verify.',removeEmail:'Remove email',removePic:'Remove picture',
 verifyPhone:'Verify mobile number',verifyEmail:'Verify email ID',enterPhoneToVerify:'Enter your phone number to get verified.',enterEmailToVerify:'Enter your email ID to get verified.',
 requestOtp:'Request OTP',enterOtp:'Enter OTP',next:'Next',change:'Change',otpDemo:'Demo mode: no message is sent. Your OTP is',
 errOtp:'Wrong OTP. Try again.',errEmail:'Enter a valid email ID.',errPhoneV:'Enter a valid mobile number.',errNeedReq:'Request an OTP first.',
 profileSaved:'Profile saved.',needFix:'To save: add your name and verify your mobile number. If you added an email ID, verify it too.',noMobile:'No mobile number added.',noEmail:'No email ID added.',verifiedDone:'Verified.',close:'Close',
 manage:'Manage',done:'Done',delVehicle:'Delete vehicle',delCompany:'Delete company',delWarnCat:'Listings under it will also be deleted:',delWarnBrand:'Listings with this company will move to Other:',whyDelete:'Why are you deleting this?',reasonMistake:'Added by mistake',reasonDup:'Duplicate',reasonNotNeeded:'Not needed',reasonWrong:'Wrong name or details',reasonOther:'Other',reasonNote:'Add a note (optional)',errReason:'Choose a reason.',deletedOk:'Deleted.',cantDeleteLast:'At least one vehicle must stay.',chooseLogo:'Choose a logo',uploadLogo:'Or upload your own logo',addVehicle:'Add vehicle',vehicleName:'Vehicle or part type',firstCompany:'Company (optional)',vehicleAdded:'Vehicle added.',addCat:'Add category',newCatName:'New category name',addCompany:'Add company',otherCity:'Other city',selCity:'Select city',errCat:'Enter a category name.',addNew:'Add new company',newCompanyName:'Company name',addBtn:'Add',errBrand:'Enter a company name.',brandAdded:'Company added.',
 vehParts:'Vehicle parts',company:'Company',companies:'Companies (A to Z)',otherBrand:'Other',
 pkgOrders:'Buy packages and my orders',pkgOrdersSub:'Packages, orders, billing and invoices',
 wishlist:'Wishlist',wishlistSub:'View your liked items here',
 eliteBuyer:'Become an elite buyer',eliteBuyerSub:'Call owners directly',
 eliteSeller:'Become an elite seller',eliteSellerSub:'Get a badge and show up first',
 settings:'Settings',settingsSub:'Privacy and logout',
 helpSupport:'Help and support',helpSub:'Help centre and legal terms',
 selectLang:'Select language',langSub:'English / Odia / Hindi',
 invBill:'Invoices and billing',buyPkg:'Buy packages',buyPkgSub:'Sell faster, more and at higher margin with packages',
 myOrders:'My orders',myOrdersSub:'Active, scheduled and expired orders',
 invoices:'Invoices',invoicesSub:'See and download your invoices',
 billingInfo:'Billing information',billingSub:'Edit your billing name, address, etc.',
 viewCart:'View cart',viewCartSub:'Check out the items in your cart to purchase',
 tabActive:'Active',tabScheduled:'Scheduled',tabExpired:'Expired',noOrders:'No orders here yet.',order:'Order',
 addToCart:'Add to cart',inCart:'View cart',buyNow:'Buy now',addedCart:'Added to cart.',extend:'Extend by 30 days',days30:'/30 days',
 noInvoices:'No invoices yet. They appear after you buy a package.',invoice:'Invoice',invDate:'Date',billedTo:'Billed to',item:'Item',amount:'Amount',
 downloadInv:'Download invoice',invSaved:'Invoice saved.',invCopied:'Invoice text copied.',noTax:'Demo invoice. Tax is not added.',validity:'Valid',
 billName:'Billing name',billAddr:'Address',billCity:'City',billState:'State',billPin:'PIN code',billGst:'GSTIN (optional)',
 saveBilling:'Save billing information',billingSaved:'Billing information saved.',errBilling:'Enter a billing name, address and a 6-digit PIN code.',errGst:'GSTIN must have 15 letters and numbers.',
 cartEmpty:'Your cart is empty',cartEmptyHint:'Add a package or elite plan to buy it here.',remove:'Remove',checkout:'Checkout',cartTotal:'Total',
 eliteBuyerName:'Elite buyer',eliteSellerName:'Elite seller',eliteActive:'Active till',
 eb_f1:'Call owners directly with one tap',eb_f2:'See numbers that sellers hide from regular buyers',
 es_f1:'Elite seller badge on your listings',es_f2:'Your listings show first with a Featured tag',es_f3:'Unlimited live listings',
 eliteBadge:'Elite seller',callNow:'Call now',numHidden:'This seller shares the number with elite buyers only.',getElite:'Become an elite buyer',sampleNum:'Sample number for demo.',
 privacy:'Privacy',hidePhone:'Hide my number from regular buyers',hidePhoneHint:'Only elite buyers can see and call your number.',privacyNote:'In this demo your data is saved on this phone only.',
 helpCentre:'Help centre',legal:'Legal terms',
 faq1q:'How do I post a listing?',faq1a:'Tap Sell, choose a category, add the price and a clear photo, then publish.',
 faq2q:'How many listings can I post for free?',faq2a:'A free account can keep 3 listings live. Packages remove this limit.',
 faq3q:'How does mobile verification work?',faq3a:'In Edit profile, tap the mobile number, request an OTP and enter it. In this demo the OTP is shown on screen.',
 faq4q:'How do I change the app language?',faq4a:'Open Account, then tap Select language.',
 terms:'Terms of use',termsTxt:'Use the app only for lawful scrap trade. Listings must be accurate. Buyers and sellers deal with each other directly.',
 privPol:'Privacy policy',privTxt:'The app stores your profile and listings. Your number is shown only as per your privacy setting.',
 legalDemo:'Demo text. Replace it with terms approved by your lawyer before launch.'
},
hi:{
 appName:'Kabadiwala.com',tagline:'अपने पास भंगार वाहन के पुर्ज़े खरीदें और बेचें।',
 login:'लॉग इन',signup:'साइन अप',phone:'मोबाइल नंबर',password:'पासवर्ड',ownerName:'आपका नाम',shopName:'दुकान का नाम',city:'शहर',
 createAccount:'खाता बनाएं',demo:'डेमो दुकान देखें',logout:'लॉग आउट',or:'या',
 errPhone:'10 अंकों का मोबाइल नंबर डालें।',errPass:'पासवर्ड कम से कम 6 अक्षर का हो।',errName:'अपना नाम और दुकान का नाम डालें।',
 errNoUser:'इस नंबर से खाता नहीं है। पहले साइन अप करें।',errWrongPass:'गलत पासवर्ड।',errExists:'इस नंबर से खाता पहले से है। लॉग इन करें।',
 searchPh:'पुर्ज़े खोजें, जैसे बाइक इंजन',all:'सभी',cats:'श्रेणियां',fresh:'नई लिस्टिंग',nothing:'कोई लिस्टिंग नहीं मिली',nothingHint:'दूसरी श्रेणी या शब्द से खोजें।',
 sortNew:'सबसे नई',sortLow:'भाव: कम से ज़्यादा',sortHigh:'भाव: ज़्यादा से कम',
 featured:'खास',sold:'बिक गया',today:'आज',yesterday:'कल',daysAgo:'दिन पहले',
 sampleNote:'"नमूना" लिखी लिस्टिंग सिर्फ़ ऐप दिखाने के उदाहरण हैं।',
 details:'विवरण',category:'श्रेणी',qty:'मात्रा',posted:'डाली गई',location:'जगह',desc:'जानकारी',seller:'विक्रेता',
 contact:'विक्रेता से संपर्क',callNo:'मोबाइल नंबर',copyNo:'नंबर कॉपी करें',copied:'नंबर कॉपी हो गया।',copyManual:'नंबर चुनकर कॉपी करें।',
 save:'सेव करें',saved:'सेव है',unsave:'सेव से हटाएं',back:'वापस',
 sell:'बेचें',navHome:'होम',navSaved:'सेव',navAds:'मेरी लिस्टिंग',navAccount:'खाता',
 postAd:'लिस्टिंग डालें',editAd:'लिस्टिंग बदलें',adTitle:'शीर्षक',adTitleEx:'जैसे हीरो स्प्लेंडर इंजन',adCat:'श्रेणी',adPrice:'भाव (₹)',adUnit:'प्रति',
 kg:'किलो',piece:'नग',quintal:'क्विंटल',adQty:'उपलब्ध मात्रा',adDesc:'जानकारी',adCity:'शहर',adPhoto:'फोटो',adPhotoHint:'साफ़ फोटो से ज़्यादा कॉल आते हैं।',
 removePhoto:'फोटो हटाएं',publish:'लिस्टिंग डालें',saveChanges:'बदलाव सेव करें',cancel:'रद्द करें',
 useMyLoc:'मेरी मौजूदा जगह इस्तेमाल करें',locFinding:'आपकी जगह खोज रहे हैं...',locSet:'जगह तय हुई:',locApprox:'अंदाज़न जगह तय हुई:',locDenied:'जगह की अनुमति नहीं मिली। नीचे से राज्य चुनें।',locFail:'आपकी जगह नहीं मिली। नीचे से राज्य चुनें।',locUnavail:'यह डिवाइस जगह नहीं बता सकता।',locNotIndia:'आप भारत के बाहर हैं। नीचे से राज्य चुनें।',allIndia:'पूरा भारत',chooseLoc:'जगह चुनें',searchLoc:'राज्य या शहर खोजें',allOf:'सभी',statesH:'राज्य और केंद्र शासित प्रदेश',citiesH:'शहर',selState:'राज्य चुनें',allStates:'सभी राज्य',errAd:'शीर्षक, 0 से ज़्यादा भाव, राज्य और शहर डालें।',published:'लिस्टिंग डल गई।',updated:'लिस्टिंग बदल गई।',deleted:'लिस्टिंग हटा दी।',
 limitMsg:'फ्री प्लान में 3 चालू लिस्टिंग तक। ज़्यादा के लिए सब्सक्राइब करें।',viewPlans:'प्लान देखें',
 myAds:'मेरी लिस्टिंग',noAds:'अभी आपकी कोई लिस्टिंग नहीं है।',markSold:'बिक गया',markLive:'फिर चालू करें',edit:'बदलें',del:'हटाएं',confirmDel:'हटाने के लिए फिर दबाएं',
 noSaved:'अभी कुछ सेव नहीं है',noSavedHint:'लिस्टिंग पर दिल दबाएं, वह यहां रहेगी।',
 plans:'प्लान',free:'फ्री',monthly:'मासिक',yearly:'वार्षिक',perMonth:'/माह',perYear:'/वर्ष',eq:'लगभग ₹125 प्रति माह',save37:'37% बचत',
 f_ads3:'3 चालू लिस्टिंग तक',f_unlimited:'असीमित चालू लिस्टिंग',f_featured:'लिस्टिंग पर "खास" निशान',f_photo:'हर लिस्टिंग पर फोटो',
 current:'मौजूदा प्लान',choose:'चुनें',validTill:'तक मान्य',expired:'समाप्त',
 payRzp:'Razorpay से सुरक्षित भुगतान करें',payRzpSub:'UPI, कार्ड, नेट बैंकिंग और वॉलेट Razorpay चेकआउट में खुलेंगे।',rzpFail:'भुगतान पूरा नहीं हुआ। इस ऑर्डर के लिए पैसे नहीं कटे।',rzpLoad:'Razorpay नहीं खुल सका। इंटरनेट देखकर फिर कोशिश करें।',payVerifyFail:'भुगतान की पुष्टि नहीं हो सकी। पैसे कटे हों तो वापस आ जाएंगे।',payMethod:'भुगतान का तरीका चुनें',pmUpi:'UPI',pmUpiSub:'Google Pay, PhonePe, Paytm, BHIM',pmCard:'क्रेडिट या डेबिट कार्ड',pmCardSub:'Visa, Mastercard, RuPay, Amex',pmNet:'नेट बैंकिंग',pmNetSub:'सभी प्रमुख भारतीय बैंक',pmWallet:'वॉलेट',pmWalletSub:'Paytm, PhonePe, Amazon Pay और अन्य',cardNo:'कार्ड नंबर',cardName:'कार्ड पर नाम',cardNameHint:'जैसा कार्ड पर छपा है',cardExp:'समाप्ति',cardCvv:'CVV',pickBank:'अपना बैंक चुनें',errCard:'सही कार्ड नंबर डालें।',errCardName:'कार्ड पर छपा नाम डालें।',errExp:'सही समाप्ति तारीख MM/YY में डालें।',errCvv:'3 अंकों का CVV डालें (Amex के लिए 4)।',errBank:'अपना बैंक चुनें।',errWallet:'वॉलेट चुनें।',paidVia:'भुगतान का तरीका',payDemoSafe:'यह डेमो भुगतान है। कोई पैसा नहीं कटेगा और कार्ड की जानकारी सेव नहीं होती।',payTitle:'भुगतान',upiId:'UPI आईडी',errUpi:'सही UPI आईडी डालें, जैसे name@bank।',payNow:'भुगतान करें',processing:'भुगतान हो रहा है…',
 paid:'भुगतान हो गया। प्लान चालू है।',demoNote:'यह डेमो भुगतान है। कोई पैसा नहीं कटेगा। असली UPI आईडी न डालें।',
 summary:'ऑर्डर का सार',total:'कुल',
 account:'खाता',language:'भाषा',owner:'मालिक',shop:'दुकान',localNote:'डेमो वर्शन: डेटा सिर्फ़ इसी फ़ोन में सेव है।',
 liveCount:'चालू',of:'में से',
 myAccount:'मेरा खाता',viewEdit:'प्रोफ़ाइल देखें और बदलें',editProfile:'प्रोफ़ाइल बदलें',memberSince:'सदस्य बने',noAbout:'अभी कोई जानकारी नहीं जोड़ी।',message:'संदेश',call:'कॉल',
 basicInfo:'बुनियादी जानकारी',selectPic:'प्रोफ़ाइल फोटो चुनें',enterName:'अपना नाम डालें',yourName:'आपका नाम',aboutYou:'अपने बारे में कुछ',aboutPh:'अपने और अपनी दुकान के बारे में कुछ पंक्तियां लिखें',
 contactInfo:'संपर्क जानकारी',countryCode:'देश कोड',mobileNo:'मोबाइल नंबर',enterMobile:'मोबाइल नंबर डालें',emailId:'ईमेल आईडी',enterEmail:'ईमेल आईडी डालें (वैकल्पिक)',
 mobileVerified:'मोबाइल नंबर सत्यापित है',emailVerified:'ईमेल आईडी सत्यापित है',notVerified:'सत्यापित नहीं है। सत्यापन के लिए दबाएं।',removeEmail:'ईमेल हटाएं',removePic:'फोटो हटाएं',
 verifyPhone:'मोबाइल नंबर सत्यापित करें',verifyEmail:'ईमेल आईडी सत्यापित करें',enterPhoneToVerify:'सत्यापन के लिए अपना फ़ोन नंबर डालें।',enterEmailToVerify:'सत्यापन के लिए अपनी ईमेल आईडी डालें।',
 requestOtp:'OTP मंगाएं',enterOtp:'OTP डालें',next:'आगे',change:'बदलें',otpDemo:'डेमो मोड: कोई संदेश नहीं जाता। आपका OTP है',
 errOtp:'गलत OTP। फिर कोशिश करें।',errEmail:'सही ईमेल आईडी डालें।',errPhoneV:'सही मोबाइल नंबर डालें।',errNeedReq:'पहले OTP मंगाएं।',
 profileSaved:'प्रोफ़ाइल सेव हो गई।',needFix:'सेव करने के लिए: अपना नाम डालें और मोबाइल नंबर सत्यापित करें। ईमेल डाला है तो उसे भी सत्यापित करें।',noMobile:'कोई मोबाइल नंबर नहीं जोड़ा।',noEmail:'कोई ईमेल आईडी नहीं जोड़ी।',verifiedDone:'सत्यापित हो गया।',close:'बंद करें',
 manage:'बदलें',done:'हो गया',delVehicle:'वाहन हटाएं',delCompany:'कंपनी हटाएं',delWarnCat:'इसके नीचे की लिस्टिंग भी हट जाएंगी:',delWarnBrand:'इस कंपनी की लिस्टिंग अन्य में चली जाएंगी:',whyDelete:'आप इसे क्यों हटा रहे हैं?',reasonMistake:'गलती से जुड़ गया',reasonDup:'दोबारा जुड़ गया',reasonNotNeeded:'ज़रूरत नहीं',reasonWrong:'नाम या जानकारी गलत',reasonOther:'अन्य',reasonNote:'नोट लिखें (वैकल्पिक)',errReason:'कारण चुनें।',deletedOk:'हटा दिया।',cantDeleteLast:'कम से कम एक वाहन रहना चाहिए।',chooseLogo:'लोगो चुनें',uploadLogo:'या अपना लोगो डालें',addVehicle:'वाहन जोड़ें',vehicleName:'वाहन या पुर्ज़े का प्रकार',firstCompany:'कंपनी (वैकल्पिक)',vehicleAdded:'वाहन जुड़ गया।',addCat:'श्रेणी जोड़ें',newCatName:'नई श्रेणी का नाम',addCompany:'कंपनी जोड़ें',otherCity:'अन्य शहर',selCity:'शहर चुनें',errCat:'श्रेणी का नाम डालें।',addNew:'नई कंपनी जोड़ें',newCompanyName:'कंपनी का नाम',addBtn:'जोड़ें',errBrand:'कंपनी का नाम डालें।',brandAdded:'कंपनी जुड़ गई।',
 vehParts:'वाहन के पुर्ज़े',company:'कंपनी',companies:'कंपनियां (A से Z)',otherBrand:'अन्य',
 pkgOrders:'पैकेज खरीदें और मेरे ऑर्डर',pkgOrdersSub:'पैकेज, ऑर्डर, बिलिंग और इनवॉइस',
 wishlist:'विशलिस्ट',wishlistSub:'यहां अपनी पसंद की चीज़ें देखें',
 eliteBuyer:'एलीट खरीदार बनें',eliteBuyerSub:'मालिकों को सीधे कॉल करें',
 eliteSeller:'एलीट विक्रेता बनें',eliteSellerSub:'बैज पाएं और सबसे ऊपर दिखें',
 settings:'सेटिंग',settingsSub:'प्राइवेसी और लॉग आउट',
 helpSupport:'सहायता और सपोर्ट',helpSub:'हेल्प सेंटर और कानूनी शर्तें',
 selectLang:'भाषा चुनें',langSub:'English / ओड़िया / हिन्दी',
 invBill:'इनवॉइस और बिलिंग',buyPkg:'पैकेज खरीदें',buyPkgSub:'पैकेज से तेज़, ज़्यादा और बेहतर मार्जिन पर बेचें',
 myOrders:'मेरे ऑर्डर',myOrdersSub:'चालू, तय और समाप्त ऑर्डर',
 invoices:'इनवॉइस',invoicesSub:'अपने इनवॉइस देखें और डाउनलोड करें',
 billingInfo:'बिलिंग जानकारी',billingSub:'बिलिंग नाम, पता आदि बदलें',
 viewCart:'कार्ट देखें',viewCartSub:'कार्ट की चीज़ें देखकर खरीदें',
 tabActive:'चालू',tabScheduled:'तय',tabExpired:'समाप्त',noOrders:'यहां अभी कोई ऑर्डर नहीं।',order:'ऑर्डर',
 addToCart:'कार्ट में डालें',inCart:'कार्ट देखें',buyNow:'अभी खरीदें',addedCart:'कार्ट में डाल दिया।',extend:'30 दिन और बढ़ाएं',days30:'/30 दिन',
 noInvoices:'अभी कोई इनवॉइस नहीं। पैकेज खरीदने पर यहां आएंगे।',invoice:'इनवॉइस',invDate:'तारीख',billedTo:'बिल किसे',item:'सामान',amount:'रकम',
 downloadInv:'इनवॉइस डाउनलोड करें',invSaved:'इनवॉइस सेव हो गया।',invCopied:'इनवॉइस का टेक्स्ट कॉपी हुआ।',noTax:'डेमो इनवॉइस। टैक्स नहीं जोड़ा गया।',validity:'मान्य',
 billName:'बिलिंग नाम',billAddr:'पता',billCity:'शहर',billState:'राज्य',billPin:'पिन कोड',billGst:'GSTIN (वैकल्पिक)',
 saveBilling:'बिलिंग जानकारी सेव करें',billingSaved:'बिलिंग जानकारी सेव हो गई।',errBilling:'बिलिंग नाम, पता और 6 अंकों का पिन कोड डालें।',errGst:'GSTIN में 15 अक्षर और अंक होने चाहिए।',
 cartEmpty:'आपका कार्ट खाली है',cartEmptyHint:'यहां खरीदने के लिए पैकेज या एलीट प्लान जोड़ें।',remove:'हटाएं',checkout:'चेकआउट',cartTotal:'कुल',
 eliteBuyerName:'एलीट खरीदार',eliteSellerName:'एलीट विक्रेता',eliteActive:'तक चालू',
 eb_f1:'एक टैप में मालिकों को सीधे कॉल करें',eb_f2:'विक्रेताओं के छिपाए नंबर भी देखें',
 es_f1:'आपकी लिस्टिंग पर एलीट विक्रेता बैज',es_f2:'आपकी लिस्टिंग "खास" निशान के साथ सबसे ऊपर',es_f3:'असीमित चालू लिस्टिंग',
 eliteBadge:'एलीट विक्रेता',callNow:'अभी कॉल करें',numHidden:'यह विक्रेता नंबर सिर्फ़ एलीट खरीदारों को दिखाता है।',getElite:'एलीट खरीदार बनें',sampleNum:'डेमो के लिए नमूना नंबर।',
 privacy:'प्राइवेसी',hidePhone:'सामान्य खरीदारों से मेरा नंबर छिपाएं',hidePhoneHint:'सिर्फ़ एलीट खरीदार आपका नंबर देख और कॉल कर सकेंगे।',privacyNote:'इस डेमो में आपका डेटा सिर्फ़ इसी फ़ोन में सेव है।',
 helpCentre:'हेल्प सेंटर',legal:'कानूनी शर्तें',
 faq1q:'लिस्टिंग कैसे डालूं?',faq1a:'"बेचें" दबाएं, श्रेणी चुनें, भाव और साफ़ फोटो डालें, फिर लिस्टिंग डालें।',
 faq2q:'मुफ़्त में कितनी लिस्टिंग डाल सकता हूं?',faq2a:'फ्री खाते में 3 लिस्टिंग चालू रह सकती हैं। पैकेज से यह सीमा हट जाती है।',
 faq3q:'मोबाइल सत्यापन कैसे होता है?',faq3a:'प्रोफ़ाइल बदलें में मोबाइल नंबर दबाएं, OTP मंगाएं और डालें। इस डेमो में OTP स्क्रीन पर दिखता है।',
 faq4q:'ऐप की भाषा कैसे बदलूं?',faq4a:'खाता खोलें, फिर "भाषा चुनें" दबाएं।',
 terms:'उपयोग की शर्तें',termsTxt:'ऐप का उपयोग सिर्फ़ वैध भंगार व्यापार के लिए करें। लिस्टिंग सही होनी चाहिए। खरीदार और विक्रेता आपस में सीधे सौदा करते हैं।',
 privPol:'प्राइवेसी नीति',privTxt:'ऐप आपकी प्रोफ़ाइल और लिस्टिंग सेव करता है। आपका नंबर आपकी प्राइवेसी सेटिंग के अनुसार ही दिखता है।',
 legalDemo:'यह डेमो टेक्स्ट है। लॉन्च से पहले इसे अपने वकील से मंज़ूर शर्तों से बदलें।'
},
or:{
 appName:'Kabadiwala.com',tagline:'ନିକଟରେ ଭଙ୍ଗାର ଯାନର ଅଂଶ କିଣନ୍ତୁ ଓ ବିକ୍ରି କରନ୍ତୁ।',
 login:'ଲଗ୍ ଇନ୍',signup:'ସାଇନ୍ ଅପ୍',phone:'ମୋବାଇଲ୍ ନମ୍ବର',password:'ପାସୱାର୍ଡ',ownerName:'ଆପଣଙ୍କ ନାମ',shopName:'ଦୋକାନର ନାମ',city:'ସହର',
 createAccount:'ଖାତା ଖୋଲନ୍ତୁ',demo:'ଡେମୋ ଦୋକାନ ଦେଖନ୍ତୁ',logout:'ଲଗ୍ ଆଉଟ୍',or:'କିମ୍ବା',
 errPhone:'10 ଅଙ୍କର ମୋବାଇଲ୍ ନମ୍ବର ଦିଅନ୍ତୁ।',errPass:'ପାସୱାର୍ଡ ଅତି କମରେ 6 ଅକ୍ଷର ହେବ।',errName:'ଆପଣଙ୍କ ନାମ ଓ ଦୋକାନର ନାମ ଦିଅନ୍ତୁ।',
 errNoUser:'ଏହି ନମ୍ବରରେ ଖାତା ନାହିଁ। ପ୍ରଥମେ ସାଇନ୍ ଅପ୍ କରନ୍ତୁ।',errWrongPass:'ଭୁଲ ପାସୱାର୍ଡ।',errExists:'ଏହି ନମ୍ବରରେ ଖାତା ଅଛି। ଲଗ୍ ଇନ୍ କରନ୍ତୁ।',
 searchPh:'ଅଂଶ ଖୋଜନ୍ତୁ, ଯେପରି ବାଇକ୍ ଇଞ୍ଜିନ୍',all:'ସବୁ',cats:'ବର୍ଗ',fresh:'ନୂଆ ତାଲିକା',nothing:'କୌଣସି ତାଲିକା ମିଳିଲା ନାହିଁ',nothingHint:'ଅନ୍ୟ ବର୍ଗ ବା ଶବ୍ଦ ଚେଷ୍ଟା କରନ୍ତୁ।',
 sortNew:'ନୂଆ ପ୍ରଥମେ',sortLow:'ଦର: କମ୍ ରୁ ଅଧିକ',sortHigh:'ଦର: ଅଧିକ ରୁ କମ୍',
 featured:'ବିଶେଷ',sold:'ବିକ୍ରି ହେଲା',today:'ଆଜି',yesterday:'ଗତକାଲି',daysAgo:'ଦିନ ପୂର୍ବେ',
 sampleNote:'"ନମୂନା" ଲେଖା ତାଲିକା କେବଳ ଆପ୍ ଦେଖାଇବା ପାଇଁ ଉଦାହରଣ।',
 details:'ବିବରଣୀ',category:'ବର୍ଗ',qty:'ପରିମାଣ',posted:'ପୋଷ୍ଟ',location:'ସ୍ଥାନ',desc:'ବର୍ଣ୍ଣନା',seller:'ବିକ୍ରେତା',
 contact:'ବିକ୍ରେତାଙ୍କୁ ଯୋଗାଯୋଗ',callNo:'ମୋବାଇଲ୍ ନମ୍ବର',copyNo:'ନମ୍ବର କପି କରନ୍ତୁ',copied:'ନମ୍ବର କପି ହେଲା।',copyManual:'ନମ୍ବର ବାଛି କପି କରନ୍ତୁ।',
 save:'ସେଭ୍',saved:'ସେଭ୍ ଅଛି',unsave:'ସେଭ୍ ରୁ ହଟାନ୍ତୁ',back:'ପଛକୁ',
 sell:'ବିକ୍ରି',navHome:'ହୋମ୍',navSaved:'ସେଭ୍',navAds:'ମୋ ତାଲିକା',navAccount:'ଖାତା',
 postAd:'ତାଲିକା ଦିଅନ୍ତୁ',editAd:'ତାଲିକା ବଦଳାନ୍ତୁ',adTitle:'ଶୀର୍ଷକ',adTitleEx:'ଯେପରି ହିରୋ ସ୍ପ୍ଲେଣ୍ଡର ଇଞ୍ଜିନ୍',adCat:'ବର୍ଗ',adPrice:'ଦର (₹)',adUnit:'ପ୍ରତି',
 kg:'କିଲୋ',piece:'ଗୋଟି',quintal:'କ୍ୱିଣ୍ଟାଲ',adQty:'ଉପଲବ୍ଧ ପରିମାଣ',adDesc:'ବର୍ଣ୍ଣନା',adCity:'ସହର',adPhoto:'ଫଟୋ',adPhotoHint:'ସ୍ପଷ୍ଟ ଫଟୋରେ ଅଧିକ କଲ୍ ଆସେ।',
 removePhoto:'ଫଟୋ ହଟାନ୍ତୁ',publish:'ତାଲିକା ପ୍ରକାଶ କରନ୍ତୁ',saveChanges:'ବଦଳ ସେଭ୍ କରନ୍ତୁ',cancel:'ବାତିଲ୍',
 useMyLoc:'ମୋର ବର୍ତ୍ତମାନ ସ୍ଥାନ ବ୍ୟବହାର କରନ୍ତୁ',locFinding:'ଆପଣଙ୍କ ସ୍ଥାନ ଖୋଜୁଛୁ...',locSet:'ସ୍ଥାନ ସ୍ଥିର ହେଲା:',locApprox:'ଆନୁମାନିକ ସ୍ଥାନ ସ୍ଥିର ହେଲା:',locDenied:'ସ୍ଥାନ ଅନୁମତି ମିଳିଲା ନାହିଁ। ତଳୁ ରାଜ୍ୟ ବାଛନ୍ତୁ।',locFail:'ଆପଣଙ୍କ ସ୍ଥାନ ମିଳିଲା ନାହିଁ। ତଳୁ ରାଜ୍ୟ ବାଛନ୍ତୁ।',locUnavail:'ଏହି ଡିଭାଇସ୍ ସ୍ଥାନ ଦେଇପାରିବ ନାହିଁ।',locNotIndia:'ଆପଣ ଭାରତ ବାହାରେ ଅଛନ୍ତି। ତଳୁ ରାଜ୍ୟ ବାଛନ୍ତୁ।',allIndia:'ସମଗ୍ର ଭାରତ',chooseLoc:'ସ୍ଥାନ ବାଛନ୍ତୁ',searchLoc:'ରାଜ୍ୟ ବା ସହର ଖୋଜନ୍ତୁ',allOf:'ସମସ୍ତ',statesH:'ରାଜ୍ୟ ଓ କେନ୍ଦ୍ରଶାସିତ ଅଞ୍ଚଳ',citiesH:'ସହର',selState:'ରାଜ୍ୟ ବାଛନ୍ତୁ',allStates:'ସମସ୍ତ ରାଜ୍ୟ',errAd:'ଶୀର୍ଷକ, 0 ରୁ ଅଧିକ ଦର, ରାଜ୍ୟ ଓ ସହର ଦିଅନ୍ତୁ।',published:'ତାଲିକା ପ୍ରକାଶ ହେଲା।',updated:'ତାଲିକା ବଦଳିଲା।',deleted:'ତାଲିକା ହଟାଗଲା।',
 limitMsg:'ଫ୍ରୀ ପ୍ଲାନରେ 3 ଚାଲୁ ତାଲିକା ପର୍ଯ୍ୟନ୍ତ। ଅଧିକ ପାଇଁ ସବ୍ସ୍କ୍ରାଇବ୍ କରନ୍ତୁ।',viewPlans:'ପ୍ଲାନ ଦେଖନ୍ତୁ',
 myAds:'ମୋ ତାଲିକା',noAds:'ଆପଣଙ୍କର ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ତାଲିକା ନାହିଁ।',markSold:'ବିକ୍ରି ହେଲା',markLive:'ପୁଣି ଚାଲୁ କରନ୍ତୁ',edit:'ବଦଳାନ୍ତୁ',del:'ହଟାନ୍ତୁ',confirmDel:'ହଟାଇବାକୁ ପୁଣି ଦାବନ୍ତୁ',
 noSaved:'ଏପର୍ଯ୍ୟନ୍ତ କିଛି ସେଭ୍ ନାହିଁ',noSavedHint:'ତାଲିକାରେ ହୃଦୟ ଦାବନ୍ତୁ, ଏଠାରେ ରହିବ।',
 plans:'ପ୍ଲାନ',free:'ଫ୍ରୀ',monthly:'ମାସିକ',yearly:'ବାର୍ଷିକ',perMonth:'/ମାସ',perYear:'/ବର୍ଷ',eq:'ପ୍ରାୟ ₹125 ମାସକୁ',save37:'37% ସଞ୍ଚୟ',
 f_ads3:'3 ଚାଲୁ ତାଲିକା ପର୍ଯ୍ୟନ୍ତ',f_unlimited:'ଅସୀମିତ ଚାଲୁ ତାଲିକା',f_featured:'ତାଲିକାରେ "ବିଶେଷ" ଚିହ୍ନ',f_photo:'ପ୍ରତ୍ୟେକ ତାଲିକାରେ ଫଟୋ',
 current:'ବର୍ତ୍ତମାନ ପ୍ଲାନ',choose:'ବାଛନ୍ତୁ',validTill:'ପର୍ଯ୍ୟନ୍ତ ବୈଧ',expired:'ମିଆଦ ସରିଛି',
 payRzp:'Razorpay ଦ୍ୱାରା ସୁରକ୍ଷିତ ପେମେଣ୍ଟ କରନ୍ତୁ',payRzpSub:'UPI, କାର୍ଡ, ନେଟ୍ ବ୍ୟାଙ୍କିଂ ଓ ୱାଲେଟ୍ Razorpay ଚେକ୍‌ଆଉଟ୍‌ରେ ଖୋଲିବ।',rzpFail:'ପେମେଣ୍ଟ ସମ୍ପୂର୍ଣ୍ଣ ହେଲା ନାହିଁ। ଏହି ଅର୍ଡର ପାଇଁ ଟଙ୍କା କଟି ନାହିଁ।',rzpLoad:'Razorpay ଖୋଲିପାରିଲା ନାହିଁ। ଇଣ୍ଟରନେଟ୍ ଦେଖି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।',payVerifyFail:'ପେମେଣ୍ଟ ଯାଞ୍ଚ ହୋଇପାରିଲା ନାହିଁ। ଟଙ୍କା କଟିଥିଲେ ଫେରିବ।',payMethod:'ପେମେଣ୍ଟ ପଦ୍ଧତି ବାଛନ୍ତୁ',pmUpi:'UPI',pmUpiSub:'Google Pay, PhonePe, Paytm, BHIM',pmCard:'କ୍ରେଡିଟ୍ ବା ଡେବିଟ୍ କାର୍ଡ',pmCardSub:'Visa, Mastercard, RuPay, Amex',pmNet:'ନେଟ୍ ବ୍ୟାଙ୍କିଂ',pmNetSub:'ସବୁ ପ୍ରମୁଖ ଭାରତୀୟ ବ୍ୟାଙ୍କ',pmWallet:'ୱାଲେଟ୍',pmWalletSub:'Paytm, PhonePe, Amazon Pay ଓ ଅନ୍ୟ',cardNo:'କାର୍ଡ ନମ୍ବର',cardName:'କାର୍ଡରେ ନାମ',cardNameHint:'କାର୍ଡରେ ଛପା ଅନୁସାରେ',cardExp:'ମିଆଦ',cardCvv:'CVV',pickBank:'ଆପଣଙ୍କ ବ୍ୟାଙ୍କ ବାଛନ୍ତୁ',errCard:'ସଠିକ୍ କାର୍ଡ ନମ୍ବର ଦିଅନ୍ତୁ।',errCardName:'କାର୍ଡରେ ଥିବା ନାମ ଦିଅନ୍ତୁ।',errExp:'ସଠିକ୍ ମିଆଦ MM/YY ରେ ଦିଅନ୍ତୁ।',errCvv:'3 ଅଙ୍କର CVV ଦିଅନ୍ତୁ (Amex ପାଇଁ 4)।',errBank:'ଆପଣଙ୍କ ବ୍ୟାଙ୍କ ବାଛନ୍ତୁ।',errWallet:'ଏକ ୱାଲେଟ୍ ବାଛନ୍ତୁ।',paidVia:'ପେମେଣ୍ଟ ଉପାୟ',payDemoSafe:'ଏହା ଡେମୋ ପେମେଣ୍ଟ। କୌଣସି ଟଙ୍କା କଟିବ ନାହିଁ ଓ କାର୍ଡ ବିବରଣୀ ସେଭ ହୁଏ ନାହିଁ।',payTitle:'ପେମେଣ୍ଟ',upiId:'UPI ID',errUpi:'ସଠିକ୍ UPI ID ଦିଅନ୍ତୁ, ଯେପରି name@bank।',payNow:'ପେମେଣ୍ଟ କରନ୍ତୁ',processing:'ପେମେଣ୍ଟ ହେଉଛି…',
 paid:'ପେମେଣ୍ଟ ହେଲା। ପ୍ଲାନ ଚାଲୁ ଅଛି।',demoNote:'ଏହା ଡେମୋ ପେମେଣ୍ଟ। କୌଣସି ଟଙ୍କା କଟିବ ନାହିଁ। ପ୍ରକୃତ UPI ID ଦିଅନ୍ତୁ ନାହିଁ।',
 summary:'ଅର୍ଡର ସାରାଂଶ',total:'ମୋଟ',
 account:'ଖାତା',language:'ଭାଷା',owner:'ମାଲିକ',shop:'ଦୋକାନ',localNote:'ଡେମୋ ସଂସ୍କରଣ: ଡାଟା କେବଳ ଏହି ଫୋନ୍‌ରେ ସେଭ୍ ହୋଇଛି।',
 liveCount:'ଚାଲୁ',of:'ମଧ୍ୟରୁ',
 myAccount:'ମୋ ଖାତା',viewEdit:'ପ୍ରୋଫାଇଲ୍ ଦେଖନ୍ତୁ ଓ ବଦଳାନ୍ତୁ',editProfile:'ପ୍ରୋଫାଇଲ୍ ବଦଳାନ୍ତୁ',memberSince:'ସଦସ୍ୟ ହୋଇଛନ୍ତି',noAbout:'ଏପର୍ଯ୍ୟନ୍ତ କିଛି ବର୍ଣ୍ଣନା ଯୋଡ଼ାଯାଇ ନାହିଁ।',message:'ମେସେଜ୍',call:'କଲ୍',
 basicInfo:'ମୌଳିକ ସୂଚନା',selectPic:'ପ୍ରୋଫାଇଲ୍ ଫଟୋ ବାଛନ୍ତୁ',enterName:'ଆପଣଙ୍କ ନାମ ଦିଅନ୍ତୁ',yourName:'ଆପଣଙ୍କ ନାମ',aboutYou:'ନିଜ ବିଷୟରେ କିଛି',aboutPh:'ନିଜ ଓ ଦୋକାନ ବିଷୟରେ କିଛି ଧାଡ଼ି ଲେଖନ୍ତୁ',
 contactInfo:'ଯୋଗାଯୋଗ ସୂଚନା',countryCode:'ଦେଶ କୋଡ୍',mobileNo:'ମୋବାଇଲ୍ ନମ୍ବର',enterMobile:'ମୋବାଇଲ୍ ନମ୍ବର ଦିଅନ୍ତୁ',emailId:'ଇମେଲ୍ ID',enterEmail:'ଇମେଲ୍ ID ଦିଅନ୍ତୁ (ଇଚ୍ଛାଧୀନ)',
 mobileVerified:'ମୋବାଇଲ୍ ନମ୍ବର ଯାଚିତ ହୋଇଛି',emailVerified:'ଇମେଲ୍ ID ଯାଚିତ ହୋଇଛି',notVerified:'ଯାଞ୍ଚ ହୋଇନାହିଁ। ଯାଞ୍ଚ ପାଇଁ ଦାବନ୍ତୁ।',removeEmail:'ଇମେଲ୍ ହଟାନ୍ତୁ',removePic:'ଫଟୋ ହଟାନ୍ତୁ',
 verifyPhone:'ମୋବାଇଲ୍ ନମ୍ବର ଯାଞ୍ଚ କରନ୍ତୁ',verifyEmail:'ଇମେଲ୍ ID ଯାଞ୍ଚ କରନ୍ତୁ',enterPhoneToVerify:'ଯାଞ୍ଚ ପାଇଁ ଆପଣଙ୍କ ଫୋନ୍ ନମ୍ବର ଦିଅନ୍ତୁ।',enterEmailToVerify:'ଯାଞ୍ଚ ପାଇଁ ଆପଣଙ୍କ ଇମେଲ୍ ID ଦିଅନ୍ତୁ।',
 requestOtp:'OTP ମାଗନ୍ତୁ',enterOtp:'OTP ଦିଅନ୍ତୁ',next:'ପରବର୍ତ୍ତୀ',change:'ବଦଳାନ୍ତୁ',otpDemo:'ଡେମୋ ମୋଡ୍: କୌଣସି ମେସେଜ୍ ଯାଏ ନାହିଁ। ଆପଣଙ୍କ OTP ହେଉଛି',
 errOtp:'ଭୁଲ OTP। ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।',errEmail:'ସଠିକ୍ ଇମେଲ୍ ID ଦିଅନ୍ତୁ।',errPhoneV:'ସଠିକ୍ ମୋବାଇଲ୍ ନମ୍ବର ଦିଅନ୍ତୁ।',errNeedReq:'ପ୍ରଥମେ OTP ମାଗନ୍ତୁ।',
 profileSaved:'ପ୍ରୋଫାଇଲ୍ ସେଭ୍ ହେଲା।',needFix:'ସେଭ୍ କରିବାକୁ: ଆପଣଙ୍କ ନାମ ଦିଅନ୍ତୁ ଓ ମୋବାଇଲ୍ ନମ୍ବର ଯାଞ୍ଚ କରନ୍ତୁ। ଇମେଲ୍ ID ଦେଇଥିଲେ ତାହା ମଧ୍ୟ ଯାଞ୍ଚ କରନ୍ତୁ।',noMobile:'କୌଣସି ମୋବାଇଲ୍ ନମ୍ବର ଯୋଡ଼ାଯାଇ ନାହିଁ।',noEmail:'କୌଣସି ଇମେଲ୍ ID ଯୋଡ଼ାଯାଇ ନାହିଁ।',verifiedDone:'ଯାଞ୍ଚ ହେଲା।',close:'ବନ୍ଦ କରନ୍ତୁ',
 manage:'ପରିଚାଳନା',done:'ହୋଇଗଲା',delVehicle:'ଯାନ ହଟାନ୍ତୁ',delCompany:'କମ୍ପାନୀ ହଟାନ୍ତୁ',delWarnCat:'ଏହା ତଳର ତାଲିକା ମଧ୍ୟ ହଟିବ:',delWarnBrand:'ଏହି କମ୍ପାନୀର ତାଲିକା ଅନ୍ୟକୁ ଯିବ:',whyDelete:'ଆପଣ କାହିଁକି ହଟାଉଛନ୍ତି?',reasonMistake:'ଭୁଲରେ ଯୋଡ଼ାଗଲା',reasonDup:'ଦୁଇଥର ଯୋଡ଼ାଗଲା',reasonNotNeeded:'ଆବଶ୍ୟକ ନାହିଁ',reasonWrong:'ନାମ ବା ବିବରଣୀ ଭୁଲ',reasonOther:'ଅନ୍ୟ',reasonNote:'ଟିପ୍ପଣୀ ଲେଖନ୍ତୁ (ଇଚ୍ଛାଧୀନ)',errReason:'କାରଣ ବାଛନ୍ତୁ।',deletedOk:'ହଟାଗଲା।',cantDeleteLast:'ଅତିକମରେ ଗୋଟିଏ ଯାନ ରହିବା ଉଚିତ।',chooseLogo:'ଲୋଗୋ ବାଛନ୍ତୁ',uploadLogo:'ବା ନିଜ ଲୋଗୋ ଅପଲୋଡ୍ କରନ୍ତୁ',addVehicle:'ଯାନ ଯୋଡ଼ନ୍ତୁ',vehicleName:'ଯାନ ବା ଅଂଶ ପ୍ରକାର',firstCompany:'କମ୍ପାନୀ (ଇଚ୍ଛାଧୀନ)',vehicleAdded:'ଯାନ ଯୋଡ଼ାଗଲା।',addCat:'ବର୍ଗ ଯୋଡ଼ନ୍ତୁ',newCatName:'ନୂଆ ବର୍ଗର ନାମ',addCompany:'କମ୍ପାନୀ ଯୋଡ଼ନ୍ତୁ',otherCity:'ଅନ୍ୟ ସହର',selCity:'ସହର ବାଛନ୍ତୁ',errCat:'ବର୍ଗର ନାମ ଦିଅନ୍ତୁ।',addNew:'ନୂଆ କମ୍ପାନୀ ଯୋଡ଼ନ୍ତୁ',newCompanyName:'କମ୍ପାନୀର ନାମ',addBtn:'ଯୋଡ଼ନ୍ତୁ',errBrand:'କମ୍ପାନୀର ନାମ ଦିଅନ୍ତୁ।',brandAdded:'କମ୍ପାନୀ ଯୋଡ଼ାଗଲା।',
 vehParts:'ଯାନର ଅଂଶ',company:'କମ୍ପାନୀ',companies:'କମ୍ପାନୀ (A ରୁ Z)',otherBrand:'ଅନ୍ୟ',
 pkgOrders:'ପ୍ୟାକେଜ୍ କିଣନ୍ତୁ ଓ ମୋ ଅର୍ଡର',pkgOrdersSub:'ପ୍ୟାକେଜ୍, ଅର୍ଡର, ବିଲିଂ ଓ ଇନଭଏସ୍',
 wishlist:'ୱିସ୍‌ଲିଷ୍ଟ',wishlistSub:'ଆପଣଙ୍କ ପସନ୍ଦର ସାମଗ୍ରୀ ଏଠାରେ ଦେଖନ୍ତୁ',
 eliteBuyer:'ଏଲିଟ୍ କ୍ରେତା ହୁଅନ୍ତୁ',eliteBuyerSub:'ମାଲିକଙ୍କୁ ସିଧାସଳଖ କଲ୍ କରନ୍ତୁ',
 eliteSeller:'ଏଲିଟ୍ ବିକ୍ରେତା ହୁଅନ୍ତୁ',eliteSellerSub:'ବ୍ୟାଜ୍ ପାଆନ୍ତୁ ଓ ସବୁଠାରୁ ଉପରେ ଦେଖାଯାଆନ୍ତୁ',
 settings:'ସେଟିଂସ୍',settingsSub:'ଗୋପନୀୟତା ଓ ଲଗ୍ ଆଉଟ୍',
 helpSupport:'ସାହାଯ୍ୟ ଓ ସହାୟତା',helpSub:'ହେଲ୍ପ ସେଣ୍ଟର ଓ ଆଇନଗତ ସର୍ତ୍ତ',
 selectLang:'ଭାଷା ବାଛନ୍ତୁ',langSub:'English / ଓଡ଼ିଆ / ହିନ୍ଦୀ',
 invBill:'ଇନଭଏସ୍ ଓ ବିଲିଂ',buyPkg:'ପ୍ୟାକେଜ୍ କିଣନ୍ତୁ',buyPkgSub:'ପ୍ୟାକେଜ୍ ସହ ଦ୍ରୁତ, ଅଧିକ ଓ ଉଚ୍ଚ ମାର୍ଜିନରେ ବିକ୍ରି କରନ୍ତୁ',
 myOrders:'ମୋ ଅର୍ଡର',myOrdersSub:'ଚାଲୁ, ନିର୍ଦ୍ଧାରିତ ଓ ମିଆଦ ସରିଥିବା ଅର୍ଡର',
 invoices:'ଇନଭଏସ୍',invoicesSub:'ଆପଣଙ୍କ ଇନଭଏସ୍ ଦେଖନ୍ତୁ ଓ ଡାଉନଲୋଡ୍ କରନ୍ତୁ',
 billingInfo:'ବିଲିଂ ସୂଚନା',billingSub:'ବିଲିଂ ନାମ, ଠିକଣା ଇତ୍ୟାଦି ବଦଳାନ୍ତୁ',
 viewCart:'କାର୍ଟ ଦେଖନ୍ତୁ',viewCartSub:'କାର୍ଟର ସାମଗ୍ରୀ ଦେଖି କିଣନ୍ତୁ',
 tabActive:'ଚାଲୁ',tabScheduled:'ନିର୍ଦ୍ଧାରିତ',tabExpired:'ମିଆଦ ସରିଛି',noOrders:'ଏଠାରେ ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଅର୍ଡର ନାହିଁ।',order:'ଅର୍ଡର',
 addToCart:'କାର୍ଟରେ ଯୋଡ଼ନ୍ତୁ',inCart:'କାର୍ଟ ଦେଖନ୍ତୁ',buyNow:'ଏବେ କିଣନ୍ତୁ',addedCart:'କାର୍ଟରେ ଯୋଡ଼ାଗଲା।',extend:'30 ଦିନ ବଢ଼ାନ୍ତୁ',days30:'/30 ଦିନ',
 noInvoices:'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଇନଭଏସ୍ ନାହିଁ। ପ୍ୟାକେଜ୍ କିଣିଲେ ଏଠାରେ ଆସିବ।',invoice:'ଇନଭଏସ୍',invDate:'ତାରିଖ',billedTo:'ବିଲ୍ କାହାକୁ',item:'ସାମଗ୍ରୀ',amount:'ରାଶି',
 downloadInv:'ଇନଭଏସ୍ ଡାଉନଲୋଡ୍ କରନ୍ତୁ',invSaved:'ଇନଭଏସ୍ ସେଭ୍ ହେଲା।',invCopied:'ଇନଭଏସ୍ ଲେଖା କପି ହେଲା।',noTax:'ଡେମୋ ଇନଭଏସ୍। ଟିକସ ଯୋଗ ହୋଇନାହିଁ।',validity:'ବୈଧ',
 billName:'ବିଲିଂ ନାମ',billAddr:'ଠିକଣା',billCity:'ସହର',billState:'ରାଜ୍ୟ',billPin:'ପିନ୍ କୋଡ୍',billGst:'GSTIN (ଇଚ୍ଛାଧୀନ)',
 saveBilling:'ବିଲିଂ ସୂଚନା ସେଭ୍ କରନ୍ତୁ',billingSaved:'ବିଲିଂ ସୂଚନା ସେଭ୍ ହେଲା।',errBilling:'ବିଲିଂ ନାମ, ଠିକଣା ଓ 6 ଅଙ୍କର ପିନ୍ କୋଡ୍ ଦିଅନ୍ତୁ।',errGst:'GSTIN ରେ 15 ଅକ୍ଷର ଓ ଅଙ୍କ ରହିବା ଉଚିତ।',
 cartEmpty:'ଆପଣଙ୍କ କାର୍ଟ ଖାଲି ଅଛି',cartEmptyHint:'କିଣିବା ପାଇଁ ଏଠାରେ ପ୍ୟାକେଜ୍ ବା ଏଲିଟ୍ ପ୍ଲାନ ଯୋଡ଼ନ୍ତୁ।',remove:'ହଟାନ୍ତୁ',checkout:'ଚେକ୍ ଆଉଟ୍',cartTotal:'ମୋଟ',
 eliteBuyerName:'ଏଲିଟ୍ କ୍ରେତା',eliteSellerName:'ଏଲିଟ୍ ବିକ୍ରେତା',eliteActive:'ପର୍ଯ୍ୟନ୍ତ ଚାଲୁ',
 eb_f1:'ଗୋଟିଏ ଟ୍ୟାପ୍‌ରେ ମାଲିକଙ୍କୁ ସିଧାସଳଖ କଲ୍ କରନ୍ତୁ',eb_f2:'ବିକ୍ରେତାମାନେ ଲୁଚାଇଥିବା ନମ୍ବର ମଧ୍ୟ ଦେଖନ୍ତୁ',
 es_f1:'ଆପଣଙ୍କ ତାଲିକାରେ ଏଲିଟ୍ ବିକ୍ରେତା ବ୍ୟାଜ୍',es_f2:'ଆପଣଙ୍କ ତାଲିକା "ବିଶେଷ" ଚିହ୍ନ ସହ ସବୁଠାରୁ ଉପରେ',es_f3:'ଅସୀମିତ ଚାଲୁ ତାଲିକା',
 eliteBadge:'ଏଲିଟ୍ ବିକ୍ରେତା',callNow:'ଏବେ କଲ୍ କରନ୍ତୁ',numHidden:'ଏହି ବିକ୍ରେତା ନମ୍ବର କେବଳ ଏଲିଟ୍ କ୍ରେତାଙ୍କୁ ଦେଖାନ୍ତି।',getElite:'ଏଲିଟ୍ କ୍ରେତା ହୁଅନ୍ତୁ',sampleNum:'ଡେମୋ ପାଇଁ ନମୂନା ନମ୍ବର।',
 privacy:'ଗୋପନୀୟତା',hidePhone:'ସାଧାରଣ କ୍ରେତାଙ୍କଠାରୁ ମୋ ନମ୍ବର ଲୁଚାନ୍ତୁ',hidePhoneHint:'କେବଳ ଏଲିଟ୍ କ୍ରେତା ଆପଣଙ୍କ ନମ୍ବର ଦେଖି କଲ୍ କରିପାରିବେ।',privacyNote:'ଏହି ଡେମୋରେ ଆପଣଙ୍କ ଡାଟା କେବଳ ଏହି ଫୋନ୍‌ରେ ସେଭ୍ ହୋଇଛି।',
 helpCentre:'ହେଲ୍ପ ସେଣ୍ଟର',legal:'ଆଇନଗତ ସର୍ତ୍ତ',
 faq1q:'ତାଲିକା କିପରି ଦେବି?',faq1a:'"ବିକ୍ରି" ଦାବନ୍ତୁ, ବର୍ଗ ବାଛନ୍ତୁ, ଦର ଓ ସ୍ପଷ୍ଟ ଫଟୋ ଦିଅନ୍ତୁ, ତାପରେ ତାଲିକା ପ୍ରକାଶ କରନ୍ତୁ।',
 faq2q:'ମାଗଣାରେ କେତୋଟି ତାଲିକା ଦେଇପାରିବି?',faq2a:'ଫ୍ରୀ ଖାତାରେ 3ଟି ତାଲିକା ଚାଲୁ ରହିପାରିବ। ପ୍ୟାକେଜ୍ ନେଲେ ଏହି ସୀମା ହଟିଯାଏ।',
 faq3q:'ମୋବାଇଲ୍ ଯାଞ୍ଚ କିପରି ହୁଏ?',faq3a:'ପ୍ରୋଫାଇଲ୍ ବଦଳାନ୍ତୁରେ ମୋବାଇଲ୍ ନମ୍ବର ଦାବନ୍ତୁ, OTP ମାଗନ୍ତୁ ଓ ଦିଅନ୍ତୁ। ଏହି ଡେମୋରେ OTP ସ୍କ୍ରିନ୍‌ରେ ଦେଖାଯାଏ।',
 faq4q:'ଆପ୍ ର ଭାଷା କିପରି ବଦଳାଇବି?',faq4a:'ଖାତା ଖୋଲନ୍ତୁ, ତାପରେ "ଭାଷା ବାଛନ୍ତୁ" ଦାବନ୍ତୁ।',
 terms:'ବ୍ୟବହାର ସର୍ତ୍ତ',termsTxt:'ଆପ୍ କେବଳ ଆଇନସମ୍ମତ ଭଙ୍ଗାର ବ୍ୟବସାୟ ପାଇଁ ବ୍ୟବହାର କରନ୍ତୁ। ତାଲିକା ସଠିକ୍ ହେବା ଉଚିତ। କ୍ରେତା ଓ ବିକ୍ରେତା ନିଜ ମଧ୍ୟରେ ସିଧାସଳଖ କାରବାର କରନ୍ତି।',
 privPol:'ଗୋପନୀୟତା ନୀତି',privTxt:'ଆପ୍ ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ଓ ତାଲିକା ସେଭ୍ କରେ। ଆପଣଙ୍କ ନମ୍ବର ଆପଣଙ୍କ ଗୋପନୀୟତା ସେଟିଂ ଅନୁସାରେ ଦେଖାଯାଏ।',
 legalDemo:'ଏହା ଡେମୋ ଲେଖା। ଲଞ୍ଚ ପୂର୍ବରୁ ଆପଣଙ୍କ ଓକିଲ ଅନୁମୋଦିତ ସର୍ତ୍ତ ସହ ବଦଳାନ୍ତୁ।'
}};
var SAMPLE_WORD={en:'Sample',hi:'नमूना',or:'ନମୂନା'};

/* ---------- India locations ---------- */
var INDIA={"Andhra Pradesh":["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Tirupati","Rajahmundry","Kakinada","Kadapa","Anantapur","Eluru","Ongole"],"Arunachal Pradesh":["Itanagar","Naharlagun","Pasighat","Tawang","Ziro","Bomdila"],"Assam":["Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon","Tinsukia","Tezpur","Bongaigaon","Dhubri"],"Bihar":["Patna","Gaya","Bhagalpur","Muzaffarpur","Purnia","Darbhanga","Arrah","Begusarai","Katihar","Munger"],"Chhattisgarh":["Raipur","Bhilai","Bilaspur","Korba","Durg","Rajnandgaon","Raigarh","Jagdalpur"],"Goa":["Panaji","Margao","Vasco da Gama","Mapusa","Ponda"],"Gujarat":["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Gandhinagar","Junagadh","Anand","Morbi","Mehsana","Bharuch"],"Haryana":["Gurugram","Faridabad","Panipat","Ambala","Hisar","Rohtak","Karnal","Sonipat","Yamunanagar","Bhiwani"],"Himachal Pradesh":["Shimla","Dharamshala","Solan","Mandi","Kullu","Baddi","Hamirpur"],"Jharkhand":["Ranchi","Jamshedpur","Dhanbad","Bokaro","Hazaribagh","Deoghar","Giridih"],"Karnataka":["Bengaluru","Mysuru","Hubballi","Mangaluru","Belagavi","Kalaburagi","Davanagere","Ballari","Shivamogga","Tumakuru","Udupi"],"Kerala":["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kollam","Kannur","Alappuzha","Palakkad","Kottayam","Malappuram"],"Madhya Pradesh":["Indore","Bhopal","Jabalpur","Gwalior","Ujjain","Sagar","Dewas","Satna","Ratlam","Rewa"],"Maharashtra":["Mumbai","Pune","Nagpur","Nashik","Thane","Aurangabad","Solapur","Kolhapur","Amravati","Nanded","Sangli","Jalgaon","Akola","Latur"],"Manipur":["Imphal","Thoubal","Bishnupur","Churachandpur"],"Meghalaya":["Shillong","Tura","Jowai","Nongpoh"],"Mizoram":["Aizawl","Lunglei","Champhai","Serchhip"],"Nagaland":["Kohima","Dimapur","Mokokchung","Tuensang"],"Odisha":["Bhubaneswar","Cuttack","Rourkela","Berhampur","Sambalpur","Puri","Balasore","Bhadrak","Baripada","Jharsuguda","Angul","Jeypore","Koraput","Rayagada"],"Punjab":["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Mohali","Pathankot","Hoshiarpur","Moga"],"Rajasthan":["Jaipur","Jodhpur","Udaipur","Kota","Bikaner","Ajmer","Alwar","Bhilwara","Sikar","Sri Ganganagar"],"Sikkim":["Gangtok","Namchi","Gyalshing","Mangan"],"Tamil Nadu":["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Erode","Vellore","Tiruppur","Thoothukudi","Hosur"],"Telangana":["Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam","Secunderabad","Mahabubnagar","Nalgonda"],"Tripura":["Agartala","Udaipur (Tripura)","Dharmanagar","Kailashahar"],"Uttar Pradesh":["Lucknow","Kanpur","Varanasi","Agra","Prayagraj","Meerut","Ghaziabad","Noida","Bareilly","Aligarh","Moradabad","Gorakhpur","Saharanpur","Jhansi","Mathura"],"Uttarakhand":["Dehradun","Haridwar","Roorkee","Haldwani","Rudrapur","Kashipur","Rishikesh"],"West Bengal":["Kolkata","Howrah","Durgapur","Asansol","Siliguri","Bardhaman","Malda","Kharagpur","Haldia","Barrackpore"],"Andaman and Nicobar Islands":["Port Blair","Diglipur","Rangat"],"Chandigarh":["Chandigarh"],"Dadra and Nagar Haveli and Daman and Diu":["Silvassa","Daman","Diu"],"Delhi":["New Delhi","Delhi","Dwarka","Rohini","Karol Bagh","Narela"],"Jammu and Kashmir":["Srinagar","Jammu","Anantnag","Baramulla","Udhampur","Kathua"],"Ladakh":["Leh","Kargil"],"Lakshadweep":["Kavaratti","Agatti","Minicoy"],"Puducherry":["Puducherry","Karaikal","Yanam","Mahe"]};

var CITY2STATE={};Object.keys(INDIA).forEach(function(st){INDIA[st].forEach(function(c){CITY2STATE[c.toLowerCase()]=st;});});
function stateOfCity(c){return CITY2STATE[String(c||'').trim().toLowerCase()]||'';}
function adState(a){return a.state||stateOfCity(a.city);}
function locLabel(){var l=S.loc||{};return l.city?(l.city+', '+l.state):(l.state||t('allIndia'));}
function cityOpts(st,sel){
  var l=INDIA[st]||[],other=!!sel&&l.indexOf(sel)<0;
  return'<option value="">'+esc(t('selCity'))+'</option>'+l.map(function(c){return'<option value="'+esc(c)+'"'+(c===sel?' selected':'')+'>'+esc(c)+'</option>';}).join('')+'<option value="__other"'+(other?' selected':'')+'>'+esc(t('otherCity'))+'</option>';
}
function syncNewCat(){var s=document.getElementById('d-cat'),w=document.getElementById('nc-wrap');if(s&&w)w.hidden=s.value!=='__newcat';}
function syncCity(){var s=document.getElementById('d-city-sel'),w=document.getElementById('cty-wrap');if(s&&w)w.hidden=s.value!=='__other';}
function citiesOpts(st){return(INDIA[st]||[]).map(function(c){return'<option value="'+esc(c)+'"></option>';}).join('');}
function stateOpts(sel){return'<option value="">'+esc(t('selState'))+'</option>'+Object.keys(INDIA).map(function(s){return'<option value="'+esc(s)+'"'+(s===sel?' selected':'')+'>'+esc(s)+'</option>';}).join('');}

/* ---------- storage ---------- */
var LS='bhangarbazaar.v1',mem=null;
function loadStore(){
  try{var s=localStorage.getItem(LS);if(s){var o=JSON.parse(s);if(o&&o.users)return o;}}catch(e){}
  return mem||{users:{},ads:[],saved:{},session:null,lang:null,seeded:false};
}
var S=loadStore();if(!S.loc)S.loc={state:'',city:''};
if(!S.customCats)S.customCats=[];if(!S.hiddenCats)S.hiddenCats=[];if(!S.hiddenBrands)S.hiddenBrands={};if(!S.deleteLog)S.deleteLog=[];
CATS=CATS.filter(function(c){return S.hiddenCats.indexOf(c.id)<0;});
S.customCats.forEach(function(c){CATS.push({id:c.id,c:c.c,n:{en:c.name,hi:c.name,or:c.name},custom:true,icon:c.icon,img:c.img});});
var CAT_COLORS=['#0F766E','#9D174D','#4D7C0F','#6D28D9','#0369A1','#B45309','#BE123C','#475569'];
function addCategory(name,icon,img){
  name=name.replace(/\s+/g,' ').trim().slice(0,24);
  for(var i=0;i<CATS.length;i++){var nn=CATS[i].n;if(nn.en.toLowerCase()===name.toLowerCase()||(nn.hi||'').toLowerCase()===name.toLowerCase())return CATS[i].id;}
  var id='u_'+Date.now().toString(36),col=CAT_COLORS[S.customCats.length%CAT_COLORS.length];
  S.customCats.push({id:id,name:name,c:col,icon:icon||'box',img:img||null});
  CATS.push({id:id,c:col,n:{en:name,hi:name,or:name},custom:true,icon:icon||'box',img:img||null});
  persist();return id;
}
function persist(){
  try{localStorage.setItem(LS,JSON.stringify(S));mem=null;}
  catch(e){mem=S;toast(t('errAd'));}
}

/* ---------- language ---------- */
function detectLang(){
  var n=(navigator.language||'en').toLowerCase();
  if(n.indexOf('hi')===0)return'hi';
  if(n.indexOf('or')===0)return'or';
  return'en';
}
var lang=S.lang||detectLang();
function t(k){return(T[lang]&&T[lang][k])||T.en[k]||k;}
function catName(c){return c.n[lang]||c.n.en;}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}
function fmt(n){try{return Number(n).toLocaleString('en-IN',{maximumFractionDigits:2});}catch(e){return String(n);}}
function fmtDate(ts){
  var loc={en:'en-IN',hi:'hi-IN',or:'or-IN'}[lang];
  try{return new Date(ts).toLocaleDateString(loc,{day:'numeric',month:'short',year:'numeric'});}
  catch(e){return new Date(ts).toLocaleDateString();}
}
function ago(ts){
  var d=Math.floor((Date.now()-ts)/864e5);
  if(d<=0)return t('today');
  if(d===1)return t('yesterday');
  return d+' '+t('daysAgo');
}

/* ---------- helpers ---------- */
var ui={payM:'upi',upiApp:'',wallet:'',view:'auth',authTab:'login',cat:'all',q:'',sort:'new',openId:null,editId:null,errKey:'',paying:false,plan:null,photo:null,confirmDel:null,prev:'home',phoneShown:false,draft:null,verify:null,showInfo:'',ordTab:'active',invId:null,checkout:[],payFrom:'plans',brand:'all',addBrand:null,locState:'',locQ:''};
function user(){return S.session?S.users[S.session]:null;}
function isPaid(u){return!!(u&&u.plan&&u.plan.until>Date.now());}
function eActive(u,k){return!!(u&&u.elite&&u.elite[k]>Date.now());}
function canPost(u){return isPaid(u)||eActive(u,'es');}
function pName(id){return({monthly:t('monthly'),yearly:t('yearly'),eliteBuyer:t('eliteBuyerName'),eliteSeller:t('eliteSellerName')})[id]||id;}
function orderStatus(o){var n=Date.now();return o.start>n?'scheduled':(o.until>n?'active':'expired');}
function orderById(id){var l=(user()&&user().orders)||[];for(var i=0;i<l.length;i++)if(l[i].id===id)return l[i];return null;}
function applyProduct(u,id,pay){
  var p=PRODUCTS[id],now=Date.now();
  var cur=p.kind==='plan'?(u.plan&&u.plan.until):(u.elite&&u.elite[p.kind]);
  /* The package starts on the payment date. Time left on an active package is kept and added on. */
  var start=now,until=((cur&&cur>now)?cur:now)+p.days*864e5;
  if(p.kind==='plan'){u.plan={id:(cur&&cur>now&&u.plan.id)||id,until:until};}
  else{u.elite=u.elite||{};u.elite[p.kind]=until;}
  u.orderSeq=(u.orderSeq||0)+1;
  (u.orders=u.orders||[]).push({id:uid(),no:'KW'+String(u.orderSeq).padStart(5,'0'),product:id,price:p.price,start:start,until:until,ts:now,pay:pay||null});
}
function copyText(txt,okKey){
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(function(){toast(t(okKey||'invCopied'));},function(){toast(t('copyManual'));});}
  else toast(t('copyManual'));
}
function invoiceText(o){
  var u=user(),b=u.billing||{};
  var lines=['Kabadiwala.com',t('invoice')+': '+o.no,t('invDate')+': '+fmtDate(o.ts),'',t('billedTo')+': '+(b.name||u.shop)];
  if(b.addr)lines.push(b.addr);
  var cs=[b.city,b.state,b.pin].filter(Boolean).join(', ');if(cs)lines.push(cs);
  if(b.gst)lines.push('GSTIN: '+b.gst);
  lines.push('',t('item')+': '+pName(o.product)+' ('+fmtDate(o.start)+' - '+fmtDate(o.until)+')',t('amount')+': Rs '+fmt(o.price),t('cartTotal')+': Rs '+fmt(o.price),(o.pay?t('paidVia')+': '+payLabel(o.pay):''),'',t('noTax'));
  return lines.join('\n');
}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
function catOf(id){for(var i=0;i<CATS.length;i++)if(CATS[i].id===id)return CATS[i];return CATS[CATS.length-1];}
function adById(id){for(var i=0;i<S.ads.length;i++)if(S.ads[i].id===id)return S.ads[i];return null;}
function myAds(){return S.ads.filter(function(a){return a.owner===S.session;});}
function mySaved(){return S.saved[S.session]||(S.saved[S.session]=[]);}
function hash(p,pw){
  try{
    return crypto.subtle.digest('SHA-256',new TextEncoder().encode(p+':'+pw)).then(function(b){
      return Array.prototype.map.call(new Uint8Array(b),function(x){return x.toString(16).padStart(2,'0');}).join('');
    });
  }catch(e){return Promise.resolve('x'+btoa(unescape(encodeURIComponent(p+':'+pw))));}
}
function seed(){
  if(S.seedVer===4)return;
  S.ads=S.ads.filter(function(a){return!a.sample;});
  SAMPLES.forEach(function(x,i){
    if(!catById(x.cat))return;
    S.ads.push({id:'s'+i,owner:'sample',sellerName:x.seller,cat:x.cat,brand:x.brand,title:x.t,price:x.p,unit:x.u,qty:x.q,city:x.city,state:stateOfCity(x.city),desc:x.d,photo:null,sold:false,feat:!!x.feat,sample:true,ts:Date.now()-x.days*864e5-i*6e4,phone:''});
  });
  var ok={};CATS.forEach(function(c){ok[c.id]=1;});
  S.ads.forEach(function(a){if(!ok[a.cat])a.cat='car';});
  S.seedVer=4;S.seeded=true;persist();
}
seed();
S.ads.forEach(function(a,i){if(a.sample&&!a.phone)a.phone='00000000'+String(10+i).slice(-2);});

/* ---------- icons ---------- */
var I={
 search:'<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 pin:'<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="9.5" r="2.5" fill="currentColor"/></svg>',
 back:'<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 heart:'<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.500S3.500 15 3.500 9A4.800 4.800 0 0 1 12 6.500 4.800 4.800 0 0 1 20.500 9c0 6-8.500 11.500-8.500 11.500z" fill="currentColor" stroke="currentColor" stroke-width="1.500" stroke-linejoin="round"/></svg>',
 heartO:'<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.500S3.500 15 3.500 9A4.800 4.800 0 0 1 12 6.500 4.800 4.800 0 0 1 20.500 9c0 6-8.500 11.500-8.500 11.500z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
 home:'<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11l8-6.500 8 6.500v8.500H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
 ads:'<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 acct:'<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="3.500" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 19c1-3.500 4-5 7-5s6 1.500 7 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 plus:'<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
 check:'<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.500l3.200 3L13 4.500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

var root=document.getElementById('root');

/* ---------- pieces ---------- */
function langBar(dark){
  var l=[['en','EN'],['hi','हिं'],['or','ଓଡ଼ି']];
  return'<div class="lang'+(dark?' dark':'')+'" role="group" aria-label="'+esc(t('language'))+'">'+l.map(function(p){
    return'<button type="button" data-act="lang" data-v="'+p[0]+'" aria-pressed="'+(lang===p[0])+'">'+p[1]+'</button>';
  }).join('')+'</div>';
}
function fld(id,label,type,ac,extra){
  return'<div class="fld"><label for="'+id+'">'+esc(label)+'</label><input id="'+id+'" name="'+id+'" type="'+type+'" autocomplete="'+ac+'" '+(extra||'')+'></div>';
}
function errLine(){return ui.errKey?'<p class="err" role="alert">'+esc(t(ui.errKey))+'</p>':'';}
function phStyle(a){
  var c=catOf(a.cat);
  return a.photo?'background-image:url('+esc(a.photo)+');background-color:'+c.c:'background-color:'+c.c;
}
function phInner(a){return a.photo?'':vsvg(a.cat,catOf(a.cat).c);}
function unitTxt(u){return t(u);}

function cardHTML(a){
  var sv=mySaved().indexOf(a.id)>-1;
  return'<div class="card" role="link" tabindex="0" data-act="open" data-v="'+a.id+'">'+
   '<div class="ph" style="'+phStyle(a)+'">'+phInner(a)+
    (a.sold?'<span class="tag sold">'+esc(t('sold'))+'</span>':(a.feat?'<span class="tag">'+esc(t('featured'))+'</span>':''))+
   '</div>'+
   '<button type="button" class="heart" data-act="heart" data-v="'+a.id+'" aria-pressed="'+sv+'" aria-label="'+esc(sv?t('unsave'):t('save'))+'">'+(sv?I.heart:I.heartO)+'</button>'+
   '<div class="info"><div class="price">₹'+fmt(a.price)+' <small>/'+esc(unitTxt(a.unit))+'</small></div>'+
   '<div class="ttl">'+esc(a.title)+'</div>'+
   '<div class="meta"><span>'+esc(a.city)+'</span><span>'+esc(ago(a.ts))+'</span></div>'+
   (a.sample?'<div class="meta"><span>'+esc(SAMPLE_WORD[lang])+'</span></div>':'')+
   '</div></div>';
}

function filtered(){
  var q=ui.q.trim().toLowerCase();
  var l=S.ads.filter(function(a){
    if(S.loc.state&&adState(a)!==S.loc.state)return false;
    if(S.loc.city&&String(a.city).toLowerCase()!==S.loc.city.toLowerCase())return false;
    if(ui.cat!=='all'&&a.cat!==ui.cat)return false;
    if(ui.cat!=='all'&&ui.brand!=='all'&&(a.brand||'__other')!==ui.brand)return false;
    if(q&&(a.title+' '+a.city+' '+a.desc+' '+(a.brand||'')+' '+catName(catOf(a.cat))).toLowerCase().indexOf(q)<0)return false;
    return true;
  });
  l.sort(function(a,b){
    if(!!a.sold!==!!b.sold)return a.sold?1:-1;
    if(ui.sort==='low')return a.price-b.price;
    if(ui.sort==='high')return b.price-a.price;
    if(!!a.feat!==!!b.feat&&ui.sort==='new')return a.feat?-1:1;
    return b.ts-a.ts;
  });
  return l;
}
function brandLabel(a){return a.brand&&a.brand!=='__other'?a.brand:t('otherBrand');}
function subsHTML(){
  if(ui.cat==='all')return'';
  var cnt={},total=0;
  S.ads.forEach(function(a){if(a.cat===ui.cat){var k=a.brand||'__other';cnt[k]=(cnt[k]||0)+1;total++;}});
  function chip(v,label,n){var b='<button type="button" class="chip" data-act="brand" data-v="'+esc(v)+'" aria-pressed="'+(ui.brand===v)+'">'+esc(label)+' ('+(n||0)+')</button>';return(ui.manage&&v!=='all'&&v!=='__other')?'<span class="catx">'+b+'<button type="button" class="xbtn" data-act="delBrandOpen" data-v="'+esc(v)+'" aria-label="'+esc(t('delCompany')+': '+label)+'">×</button></span>':b;}
  var chips=chip('all',t('all'),total)+brandsOf(ui.cat).map(function(b){return chip(b,b,cnt[b]);}).join('')+chip('__other',t('otherBrand'),cnt['__other'])+'<button type="button" class="chip add" data-act="addBrandOpen" data-v="x">+ '+esc(t('addCompany'))+'</button>';
  return'<div class="subh">'+esc(t('companies'))+' · '+esc(catName(catOf(ui.cat)))+'</div><div class="subs">'+chips+'</div>';
}
function feedHTML(){
  var l=filtered();
  if(!l.length)return'<div class="empty"><h3>'+esc(t('nothing'))+'</h3><p>'+esc(t('nothingHint'))+'</p>'+((S.loc.state)?'<button type="button" class="btn btn-ghost" data-act="locAll" data-v="x">'+esc(t('allIndia'))+'</button>':'')+'</div>';
  return'<div class="grid">'+l.map(cardHTML).join('')+'</div>'+(l.some(function(a){return a.sample;})?'<p class="note">'+esc(t('sampleNote'))+'</p>':'');
}

/* ---------- views ---------- */
function authView(){
  var login=ui.authTab==='login';
  return'<div class="auth pad"><div class="auth-top">'+langBar(true)+'</div>'+
   '<div class="hero"><h1>Kabadiwala<span>.com</span></h1><p>'+esc(t('tagline'))+'</p></div>'+
   '<div class="tabs" role="tablist">'+
    '<button type="button" role="tab" data-act="authTab" data-v="login" aria-selected="'+login+'">'+esc(t('login'))+'</button>'+
    '<button type="button" role="tab" data-act="authTab" data-v="signup" aria-selected="'+!login+'">'+esc(t('signup'))+'</button></div>'+
   '<form id="'+(login?'f-login':'f-signup')+'" novalidate>'+
    (login?'':fld('a-name',t('ownerName'),'text','name')+fld('a-shop',t('shopName'),'text','organization')+fld('a-city',t('city'),'text','address-level2'))+
    fld('a-phone',t('phone'),'tel','tel','inputmode="numeric" maxlength="10" pattern="[0-9]*"')+
    fld('a-pass',t('password'),'password',login?'current-password':'new-password')+
    errLine()+
    '<button class="btn btn-primary block" type="submit">'+esc(login?t('login'):t('createAccount'))+'</button></form>'+
   '<div class="sep">'+esc(t('or'))+'</div>'+
   '<button class="btn btn-ghost block" type="button" data-act="demo">'+esc(t('demo'))+'</button></div>';
}

function homeView(){
  var u=user();
  var cats='<button type="button" class="cat" data-act="cat" data-v="all" aria-pressed="'+(ui.cat==='all')+'"><span class="dot" style="background:var(--navy)">★</span><small>'+esc(t('all'))+'</small></button>'+
    CATS.map(function(c){var b='<button type="button" class="cat" data-act="cat" data-v="'+c.id+'" aria-pressed="'+(ui.cat===c.id)+'"><span class="dot" style="background:'+c.c+'">'+vsvg(c.id,c.c)+'</span><small>'+esc(catName(c))+'</small></button>';return ui.manage?'<span class="catx">'+b+'<button type="button" class="xbtn" data-act="delCatOpen" data-v="'+c.id+'" aria-label="'+esc(t('delVehicle')+': '+catName(c))+'">×</button></span>':b;}).join('')+
    '<button type="button" class="cat" data-act="addCatOpen" data-v="x"><span class="dot" style="background:var(--surface);color:var(--accent);border:2px dashed var(--accent)">+</span><small>'+esc(t('addVehicle'))+'</small></button>';
  return'<header class="hdr pad"><div class="hrow"><div class="logo-t">Kabadiwala<span>.com</span></div><div class="grow"></div>'+langBar(false)+'</div>'+
    '<div class="hrow"><button type="button" class="loc" data-act="nav" data-v="location" aria-label="'+esc(t('chooseLoc'))+'">'+I.pin+'<span>'+esc(locLabel())+'</span></button><div class="search grow">'+I.search+'<input id="q" type="search" placeholder="'+esc(t('searchPh'))+'" value="'+esc(ui.q)+'" aria-label="'+esc(t('searchPh'))+'"></div></div></header>'+
   '<main class="pad"><div style="display:flex;align-items:center;justify-content:space-between;margin-top:14px"><h2 style="font-size:20px">'+esc(t('vehParts'))+'</h2><button type="button" class="mnglink" data-act="toggleManage" data-v="x">'+esc(ui.manage?t('done'):t('manage'))+'</button></div><div class="catwrap"><button type="button" class="carrow l" data-act="catScroll" data-v="-1" aria-label="Scroll left"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="cats" id="cats" aria-label="'+esc(t('vehParts'))+'" style="padding-top:8px">'+cats+'</div><button type="button" class="carrow r" data-act="catScroll" data-v="1" aria-label="Scroll right"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>'+subsHTML()+
   '<div class="sec"><h2>'+esc(t('fresh'))+'</h2><select id="sort" class="sort" aria-label="Sort"><option value="new"'+(ui.sort==='new'?' selected':'')+'>'+esc(t('sortNew'))+'</option><option value="low"'+(ui.sort==='low'?' selected':'')+'>'+esc(t('sortLow'))+'</option><option value="high"'+(ui.sort==='high'?' selected':'')+'>'+esc(t('sortHigh'))+'</option></select></div>'+
   '<div id="feed">'+feedHTML()+'</div></main>';
}

function subBar(title,backTo){
  return'<header class="bar pad"><button type="button" class="ibtn" data-act="nav" data-v="'+backTo+'" aria-label="'+esc(t('back'))+'">'+I.back+'</button><h2>'+esc(title)+'</h2></header>';
}


var STATE_ALIAS={'orissa':'Odisha','nct of delhi':'Delhi','national capital territory of delhi':'Delhi','uttaranchal':'Uttarakhand','jammu & kashmir':'Jammu and Kashmir','andaman & nicobar islands':'Andaman and Nicobar Islands','andaman and nicobar':'Andaman and Nicobar Islands','pondicherry':'Puducherry','dadra and nagar haveli':'Dadra and Nagar Haveli and Daman and Diu','daman and diu':'Dadra and Nagar Haveli and Daman and Diu','telengana':'Telangana'};
var CITY_ALIAS={'bangalore':'Bengaluru','bengaluru urban':'Bengaluru','bombay':'Mumbai','calcutta':'Kolkata','madras':'Chennai','mysore':'Mysuru','cochin':'Kochi','trivandrum':'Thiruvananthapuram','vizag':'Visakhapatnam','gurgaon':'Gurugram','allahabad':'Prayagraj','benares':'Varanasi','baroda':'Vadodara','poona':'Pune','bhubaneshwar':'Bhubaneswar','orissa':'Odisha'};
function matchState(n){
  n=String(n||'').trim().toLowerCase();if(!n)return'';
  if(STATE_ALIAS[n])return STATE_ALIAS[n];
  var k=Object.keys(INDIA);for(var i=0;i<k.length;i++)if(k[i].toLowerCase()===n)return k[i];
  return'';
}
function matchCity(st,names){
  var l=INDIA[st]||[];
  for(var j=0;j<names.length;j++){
    var n=String(names[j]||'').trim().toLowerCase();if(!n)continue;
    if(CITY_ALIAS[n])n=CITY_ALIAS[n].toLowerCase();
    n=n.replace(/ (district|city|municipal corporation)$/,'');
    for(var i=0;i<l.length;i++)if(l[i].toLowerCase()===n)return l[i];
  }
  return'';
}
function setPlace(st,names,approx){
  var ct=matchCity(st,names);
  S.loc={state:st,city:ct};persist();ui.locBusy=false;go('home');
  toast(t(approx?'locApprox':'locSet')+' '+(ct?ct+', ':'')+st);
}
function locFailed(k){ui.locBusy=false;render(true);toast(t(k||'locFail'));}
function viaIP(){
  var tries=[
    function(){return fetch('https://ipwho.is/').then(function(r){return r.json();}).then(function(g){if(g&&g.success===false)throw 0;return{cc:g.country_code,st:g.region,ct:[g.city]};});},
    function(){return fetch('https://get.geojs.io/v1/ip/geo.json').then(function(r){return r.json();}).then(function(g){return{cc:g.country_code,st:g.region,ct:[g.city]};});}
  ];
  function next(i){
    if(i>=tries.length)return locFailed('locFail');
    tries[i]().then(function(g){
      if(g.cc&&g.cc!=='IN')return locFailed('locNotIndia');
      var st=matchState(g.st);
      if(!st)return next(i+1);
      setPlace(st,g.ct,true);
    }).catch(function(){next(i+1);});
  }
  next(0);
}
function useMyLocation(){
  ui.locBusy=true;render(true);
  if(!navigator.geolocation){viaIP();return;}
  navigator.geolocation.getCurrentPosition(function(pos){
    var u='https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='+pos.coords.latitude+'&longitude='+pos.coords.longitude+'&localityLanguage=en';
    fetch(u).then(function(r){if(!r.ok)throw new Error('http');return r.json();}).then(function(g){
      if(g.countryCode&&g.countryCode!=='IN')return locFailed('locNotIndia');
      var st=matchState(g.principalSubdivision);
      if(!st)return viaIP();
      var names=[g.city,g.locality];
      if(g.localityInfo&&g.localityInfo.administrative)names=names.concat(g.localityInfo.administrative.map(function(x){return x.name;}));
      setPlace(st,names,false);
    }).catch(function(){viaIP();});
  },function(){viaIP();},{enableHighAccuracy:false,timeout:12000,maximumAge:300000});
}
function locListHTML(){
  var q=(ui.locQ||'').trim().toLowerCase(),st=ui.locState,out='';
  function row(act,v,label,sel,n){return'<button type="button" class="lrow" data-act="'+act+'" data-v="'+esc(v)+'" aria-pressed="'+sel+'"><span>'+esc(label)+'</span>'+(n!=null?'<small>'+n+'</small>':'')+(sel?'<b>✓</b>':'')+'</button>';}
  var cnt={},ccnt={};
  S.ads.forEach(function(a){var s=adState(a);if(s)cnt[s]=(cnt[s]||0)+1;ccnt[String(a.city).toLowerCase()]=(ccnt[String(a.city).toLowerCase()]||0)+1;});
  if(!st){
    var sts=Object.keys(INDIA).filter(function(s){return!q||s.toLowerCase().indexOf(q)>-1||INDIA[s].some(function(c){return c.toLowerCase().indexOf(q)>-1;});});
    out+=row('locAll','x',t('allIndia'),!S.loc.state,S.ads.length)+'<div class="subh">'+esc(t('statesH'))+'</div>';
    out+=sts.map(function(s){
      var hit=q?INDIA[s].filter(function(c){return c.toLowerCase().indexOf(q)>-1;}):[];
      return row('locState',s,s+(hit.length&&s.toLowerCase().indexOf(q)<0?' · '+hit.slice(0,2).join(', '):''),S.loc.state===s&&!S.loc.city,cnt[s]||0);
    }).join('');
    if(!sts.length)out+='<p class="note">'+esc(t('nothing'))+'</p>';
  }else{
    var cs=INDIA[st].filter(function(c){return!q||c.toLowerCase().indexOf(q)>-1;});
    out+='<button type="button" class="lnk" data-act="locBack" data-v="x">‹ '+esc(t('allStates'))+'</button>';
    out+='<div class="subh">'+esc(st)+'</div>'+row('locPick',st+'|','◉ '+t('allOf')+' '+st,S.loc.state===st&&!S.loc.city,cnt[st]||0);
    out+='<div class="subh">'+esc(t('citiesH'))+'</div>'+cs.map(function(c){return row('locPick',st+'|'+c,c,S.loc.state===st&&S.loc.city===c,ccnt[c.toLowerCase()]||0);}).join('');
  }
  return out;
}
function locationView(){
  return subBar(t('chooseLoc'),'home')+'<main class="pad" style="padding-block:12px 96px"><button type="button" class="btn btn-ghost block gps" data-act="locGPS" data-v="x"'+(ui.locBusy?' disabled':'')+'>'+I.pin+' '+esc(ui.locBusy?t('locFinding'):t('useMyLoc'))+'</button><div class="search" style="margin-bottom:10px">'+I.search+'<input id="loc-q" type="search" placeholder="'+esc(t('searchLoc'))+'" value="'+esc(ui.locQ||'')+'" autocomplete="off"></div><div id="loc-list">'+locListHTML()+'</div></main>';
}

function detailView(){
  var a=adById(ui.openId);
  if(!a)return homeView();
  var c=catOf(a.cat),sv=mySaved().indexOf(a.id)>-1,mine=a.owner===S.session;
  var sellerName=a.sample?a.sellerName:(S.users[a.owner]?S.users[a.owner].shop:a.sellerName||'');
  var ow=S.users[a.owner],phone=a.sample?(a.phone||''):((ow&&ow.mobileV&&ow.mobile)||a.owner);
  var eb=eActive(user(),'eb'),hidden=!!(ow&&ow.hidePhone&&!eb&&!mine);
  return subBar(catName(c),ui.prev||'home')+
   '<main class="pad dwrap"><div style="position:relative"><div class="ph big" style="'+phStyle(a)+';border-radius:12px">'+phInner(a)+(a.sold?'<span class="tag sold">'+esc(t('sold'))+'</span>':(a.feat?'<span class="tag">'+esc(t('featured'))+'</span>':''))+'</div>'+
   '<button type="button" class="heart" data-act="heart" data-v="'+a.id+'" aria-pressed="'+sv+'" aria-label="'+esc(sv?t('unsave'):t('save'))+'">'+(sv?I.heart:I.heartO)+'</button></div>'+
   '<div class="dcard"><div class="dprice">₹'+fmt(a.price)+' <small>/'+esc(unitTxt(a.unit))+'</small></div><h1 style="font-size:20px">'+esc(a.title)+'</h1>'+
    '<div class="meta" style="font-size:13px"><span>'+esc(a.city)+'</span><span>'+esc(ago(a.ts))+'</span></div>'+(a.sample?'<span class="badge" style="align-self:flex-start">'+esc(SAMPLE_WORD[lang])+'</span>':'')+'</div>'+
   '<div class="dcard"><h3 style="font-size:17px">'+esc(t('details'))+'</h3><dl class="kv"><dt>'+esc(t('category'))+'</dt><dd>'+esc(catName(c))+'</dd><dt>'+esc(t('company'))+'</dt><dd>'+esc(brandLabel(a))+'</dd>'+
    (a.qty?'<dt>'+esc(t('qty'))+'</dt><dd>'+fmt(a.qty)+' '+esc(unitTxt(a.unit))+'</dd>':'')+
    '<dt>'+esc(t('location'))+'</dt><dd>'+esc(a.city+(adState(a)?', '+adState(a):''))+'</dd><dt>'+esc(t('posted'))+'</dt><dd>'+esc(fmtDate(a.ts))+'</dd></dl></div>'+
   (a.desc?'<div class="dcard"><h3 style="font-size:17px">'+esc(t('desc'))+'</h3><p style="margin:0;overflow-wrap:anywhere">'+esc(a.desc)+'</p></div>':'')+
   '<div class="dcard"><div class="seller"><span class="av" aria-hidden="true">'+esc((Array.from(sellerName)[0]||'?').toUpperCase())+'</span><div style="min-width:0"><div class="note" style="margin:0">'+esc(t('seller'))+'</div><b style="overflow-wrap:anywhere">'+esc(sellerName)+'</b></div></div>'+
    ((ui.phoneShown||eb)&&phone&&!hidden?'<dl class="kv" style="margin-top:6px"><dt>'+esc(t('callNo'))+'</dt><dd style="user-select:all">'+esc(phone)+'</dd></dl>'+(a.sample?'<p class="note" style="margin:0">'+esc(t('sampleNum'))+'</p>':''):'')+
    (hidden&&phone?'<p class="note" style="margin:6px 0 0">'+esc(t('numHidden'))+'</p>':'')+
    (eActive(ow,'es')?'<span class="badge gold" style="align-self:flex-start">'+esc(t('eliteBadge'))+'</span>':'')+'</div></main>'+
   '<div class="cbar pad">'+(mine?'<button type="button" class="btn btn-ghost" data-act="edit" data-v="'+a.id+'">'+esc(t('edit'))+'</button>':
    contactBtns(a,phone,hidden,eb,sv))+'</div>';
}

function contactBtns(a,phone,hidden,eb,sv){
  var save='<button type="button" class="btn btn-ghost" data-act="heart" data-v="'+a.id+'">'+esc(sv?t('saved'):t('save'))+'</button>';
  if(!phone)return save;
  if(hidden)return save+'<button type="button" class="btn btn-gold" data-act="nav" data-v="ebuyer">'+esc(t('getElite'))+'</button>';
  if(eb)return'<a class="btn btn-primary" href="tel:'+esc(phone)+'">'+esc(t('callNow'))+'</a><button type="button" class="btn btn-navy" data-act="copyNo" data-v="'+esc(phone)+'">'+esc(t('copyNo'))+'</button>';
  return ui.phoneShown?'<button type="button" class="btn btn-navy" data-act="copyNo" data-v="'+esc(phone)+'">'+esc(t('copyNo'))+'</button>':'<button type="button" class="btn btn-primary" data-act="showNo">'+esc(t('contact'))+'</button>';
}
function brandOpts(cat,sel){
  return brandsOf(cat).map(function(b){return'<option value="'+esc(b)+'"'+(sel===b?' selected':'')+'>'+esc(b)+'</option>';}).join('')+
    '<option value="__other"'+(sel==='__other'?' selected':'')+'>'+esc(t('otherBrand'))+'</option>'+
    '<option value="__new">+ '+esc(t('addCompany'))+'</option>';
}
function brandModal(){
  var m=ui.addBrand;if(!m)return'';
  var ttl=t('addNew')+' · '+catName(catOf(m.cat));
  return'<div class="scrim" data-act="closeAddBrand"></div><div class="sheet pad" role="dialog" aria-modal="true" aria-label="'+esc(ttl)+'">'+
   '<div class="phead"><h2>'+esc(ttl)+'</h2><button type="button" class="ibtn" style="color:var(--ink)" data-act="closeAddBrand" aria-label="'+esc(t('close'))+'"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button></div>'+
   '<form id="f-addbrand" novalidate><div class="fld"><label for="nb-name">'+esc(t('newCompanyName'))+'</label><input id="nb-name" type="text" maxlength="30" autocomplete="off"></div>'+errLine()+
   '<div class="stack"><button class="btn btn-primary block" type="submit">'+esc(t('addBtn'))+'</button><button type="button" class="btn btn-ghost block" data-act="closeAddBrand">'+esc(t('cancel'))+'</button></div></form></div>';
}
function catModal(){
  if(!ui.addCatM)return'';
  var ttl=t('addVehicle');
  return'<div class="scrim" data-act="closeAddCat"></div><div class="sheet pad" role="dialog" aria-modal="true" aria-label="'+esc(ttl)+'">'+
   '<div class="phead"><h2>'+esc(ttl)+'</h2><button type="button" class="ibtn" style="color:var(--ink)" data-act="closeAddCat" aria-label="'+esc(t('close'))+'"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button></div>'+
   '<form id="f-addcat" novalidate><div class="fld"><label for="ac-name">'+esc(t('vehicleName'))+'</label><input id="ac-name" type="text" maxlength="24" autocomplete="off"></div>'+
   '<div class="fld"><label>'+esc(t('chooseLogo'))+'</label><div class="igrid">'+ICON_KEYS.map(function(k){return'<button type="button" data-act="pickIcon" data-v="'+k+'" aria-pressed="'+(!ui.addCatM.img&&ui.addCatM.icon===k)+'" aria-label="'+k+'">'+iconSvg(k)+'</button>';}).join('')+'</div>'+
   '<label for="ac-logo" style="margin-top:2px">'+esc(t('uploadLogo'))+'</label><input id="ac-logo" type="file" accept="image/*">'+(ui.addCatM.img?'<div style="display:flex;align-items:center;gap:12px"><img class="logoprev" alt="" src="'+esc(ui.addCatM.img)+'"><button type="button" class="lnk danger" data-act="rmLogo" data-v="x">'+esc(t('removePhoto'))+'</button></div>':'')+'</div>'+
   '<div class="fld"><label for="ac-brand">'+esc(t('firstCompany'))+'</label><input id="ac-brand" type="text" maxlength="30" autocomplete="off"></div>'+errLine()+
   '<div class="stack"><button class="btn btn-primary block" type="submit">'+esc(t('addBtn'))+'</button><button type="button" class="btn btn-ghost block" data-act="closeAddCat">'+esc(t('cancel'))+'</button></div></form></div>';
}
function saveVehicle(){
  var name=val('ac-name'),br=val('ac-brand');
  if(!name)return fail('errCat');
  var id=addCategory(name,ui.addCatM.icon,ui.addCatM.img);
  if(br)addBrand(id,br);
  ui.cat=id;ui.brand='all';ui.addCatM=null;ui.errKey='';render(false);toast(t('vehicleAdded'));
}
var REASONS=['reasonMistake','reasonDup','reasonNotNeeded','reasonWrong','reasonOther'];
function delModal(){
  var m=ui.delM;if(!m)return'';
  var name=m.kind==='cat'?catName(catOf(m.id)):(m.id),n;
  if(m.kind==='cat')n=S.ads.filter(function(a){return a.cat===m.id;}).length;
  else n=S.ads.filter(function(a){return a.cat===m.cat&&(a.brand||'__other')===m.id;}).length;
  var ttl=t(m.kind==='cat'?'delVehicle':'delCompany')+': '+name;
  return'<div class="scrim" data-act="closeDel"></div><div class="sheet pad" role="dialog" aria-modal="true" aria-label="'+esc(ttl)+'" style="max-height:90vh;overflow:auto">'+
   '<div class="phead"><h2>'+esc(ttl)+'</h2><button type="button" class="ibtn" style="color:var(--ink)" data-act="closeDel" aria-label="'+esc(t('close'))+'"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button></div>'+
   (n?'<div class="warnbox">'+esc(t(m.kind==='cat'?'delWarnCat':'delWarnBrand'))+' <b>'+n+'</b></div>':'')+
   '<div class="fld"><label>'+esc(t('whyDelete'))+'</label>'+REASONS.map(function(r){return'<button type="button" class="rsn" data-act="pickReason" data-v="'+r+'" aria-pressed="'+(m.reason===r)+'">'+esc(t(r))+'</button>';}).join('')+'</div>'+
   '<div class="fld"><label for="dl-note">'+esc(t('reasonNote'))+'</label><textarea id="dl-note" maxlength="200">'+esc(m.note||'')+'</textarea></div>'+errLine()+
   '<div class="stack"><button type="button" class="btn btn-primary block" style="background:var(--danger,#B4232A);border-color:var(--danger,#B4232A)" data-act="confirmDel2" data-v="x">'+esc(t('del'))+'</button><button type="button" class="btn btn-ghost block" data-act="closeDel">'+esc(t('cancel'))+'</button></div></div>';
}
function doDelete(){
  var m=ui.delM;if(!m)return;
  var note=val('dl-note');
  if(!m.reason)return fail('errReason');
  var name;
  if(m.kind==='cat'){
    name=catName(catOf(m.id));
    S.ads=S.ads.filter(function(a){return a.cat!==m.id;});
    var ci=-1;S.customCats.forEach(function(c,i){if(c.id===m.id)ci=i;});
    if(ci>-1)S.customCats.splice(ci,1);else if(S.hiddenCats.indexOf(m.id)<0)S.hiddenCats.push(m.id);
    CATS=CATS.filter(function(c){return c.id!==m.id;});
    if(ui.cat===m.id)ui.cat='all';
    ui.brand='all';
  }else{
    name=m.id;
    S.ads.forEach(function(a){if(a.cat===m.cat&&(a.brand||'__other')===m.id)a.brand='__other';});
    var cb=(S.customBrands&&S.customBrands[m.cat])||[],bi=cb.indexOf(m.id);
    if(bi>-1)cb.splice(bi,1);else{(S.hiddenBrands[m.cat]=S.hiddenBrands[m.cat]||[]).push(m.id);}
    ui.brand='all';
  }
  S.deleteLog.push({kind:m.kind,name:name,reason:m.reason,note:note,ts:Date.now()});
  persist();ui.delM=null;ui.errKey='';render(false);toast(t('deletedOk'));
}
function syncNewBrand(){var sb=document.getElementById('d-brand'),w=document.getElementById('nb-wrap');if(sb&&w)w.hidden=sb.value!=='__new';}
function saveBrand(){
  var name=val('nb-name');
  if(!name)return fail('errBrand');
  var n=addBrand(ui.addBrand.cat,name);
  ui.brand=n;ui.addBrand=null;ui.errKey='';render(false);toast(t('brandAdded'));
}
function sellView(){
  var u=user(),paid=canPost(u);
  var e=ui.editId?adById(ui.editId):null;
  var live=myAds().filter(function(a){return!a.sold;}).length;
  if(!e&&!paid&&live>=FREE_ADS){
    return subBar(t('postAd'),'home')+'<main class="pad" style="padding-block:16px"><div class="warn">'+esc(t('limitMsg'))+'</div><button type="button" class="btn btn-gold block" data-act="nav" data-v="plans">'+esc(t('viewPlans'))+'</button></main>';
  }
  var v=e||{cat:'car',title:'',price:'',unit:'piece',qty:'',city:S.loc.city||u.city||'',state:S.loc.state||stateOfCity(u.city)||'',desc:''};
  var vst=v.state||adState(v)||'';
  var catOpts=CATS.map(function(c){return'<option value="'+c.id+'"'+(v.cat===c.id?' selected':'')+'>'+esc(catName(c))+'</option>';}).join('')+'<option value="__newcat">+ '+esc(t('addCat'))+'</option>';
  var unitOpts=['kg','piece','quintal'].map(function(x){return'<option value="'+x+'"'+(v.unit===x?' selected':'')+'>'+esc(t(x))+'</option>';}).join('');
  return subBar(e?t('editAd'):t('postAd'),e?'ads':'home')+
   '<main class="pad" style="padding-block:16px"><form id="f-ad" novalidate>'+
    '<div class="fld"><label for="d-cat">'+esc(t('adCat'))+'</label><select id="d-cat">'+catOpts+'</select></div>'+
    '<div class="fld" id="nc-wrap" hidden><label for="d-newcat">'+esc(t('newCatName'))+'</label><input id="d-newcat" type="text" maxlength="24" autocomplete="off"></div>'+
    '<div class="fld"><label for="d-brand">'+esc(t('company'))+'</label><select id="d-brand">'+brandOpts(v.cat,v.brand)+'</select></div>'+
    '<div class="fld" id="nb-wrap" hidden><label for="d-newbrand">'+esc(t('newCompanyName'))+'</label><input id="d-newbrand" type="text" maxlength="30" autocomplete="off"></div>'+
    '<div class="fld"><label for="d-title">'+esc(t('adTitle'))+'</label><input id="d-title" type="text" autocomplete="off" placeholder="'+esc(t('adTitleEx'))+'" value="'+esc(v.title)+'"></div>'+
    '<div class="two"><div class="fld"><label for="d-price">'+esc(t('adPrice'))+'</label><input id="d-price" type="number" inputmode="decimal" min="0" step="any" value="'+esc(v.price)+'"></div>'+
    '<div class="fld"><label for="d-unit">'+esc(t('adUnit'))+'</label><select id="d-unit">'+unitOpts+'</select></div></div>'+
    '<div class="fld"><label for="d-qty">'+esc(t('adQty'))+'</label><input id="d-qty" type="number" inputmode="decimal" min="0" step="any" value="'+esc(v.qty)+'"></div>'+
    '<div class="two"><div class="fld"><label for="d-state">'+esc(t('billState'))+'</label><select id="d-state">'+stateOpts(vst)+'</select></div>'+
    '<div class="fld"><label for="d-city">'+esc(t('adCity'))+'</label><select id="d-city-sel">'+cityOpts(vst,v.city)+'</select></div></div>'+
    '<div class="fld" id="cty-wrap"'+((v.city&&(INDIA[vst]||[]).indexOf(v.city)<0)?'':' hidden')+'><label for="d-city">'+esc(t('otherCity'))+'</label><input id="d-city" type="text" autocomplete="off" value="'+esc((v.city&&(INDIA[vst]||[]).indexOf(v.city)<0)?v.city:'')+'"></div>'+
    '<div class="fld"><label for="d-desc">'+esc(t('adDesc'))+'</label><textarea id="d-desc">'+esc(v.desc||'')+'</textarea></div>'+
    '<div class="fld"><label for="photo">'+esc(t('adPhoto'))+'</label><input id="photo" type="file" accept="image/*"><span class="note" style="margin:0">'+esc(t('adPhotoHint'))+'</span>'+
     (ui.photo?'<div class="ph" style="width:120px;border-radius:10px;background-image:url('+esc(ui.photo)+');background-color:#888"></div><button type="button" class="lnk danger" style="align-self:flex-start" data-act="rmPhoto">'+esc(t('removePhoto'))+'</button>':'')+'</div>'+
    errLine()+
    '<div class="stack"><button class="btn btn-primary block" type="submit">'+esc(e?t('saveChanges'):t('publish'))+'</button>'+
    '<button class="btn btn-ghost block" type="button" data-act="nav" data-v="'+(e?'ads':'home')+'">'+esc(t('cancel'))+'</button></div></form></main>';
}

function adsView(){
  var u=user(),paid=isPaid(u),l=myAds().sort(function(a,b){return b.ts-a.ts;});
  var live=l.filter(function(a){return!a.sold;}).length;
  var badge=paid?'<span class="badge gold">'+esc(t(u.plan.id))+'</span>':'<span class="badge">'+esc(t('free'))+' · '+live+' '+esc(t('of'))+' '+FREE_ADS+' '+esc(t('liveCount'))+'</span>';
  return subBar(t('myAds'),'home')+'<main class="pad" style="padding-block:14px">'+
   '<div class="sec" style="margin-top:0">'+badge+'<button type="button" class="lnk" data-act="nav" data-v="plans">'+esc(t('plans'))+'</button></div>'+
   (l.length?l.map(function(a){
     var conf=ui.confirmDel===a.id;
     return'<div class="arow"><div class="ph" style="'+phStyle(a)+'">'+phInner(a)+'</div><div style="min-width:0"><div class="price">₹'+fmt(a.price)+' <small>/'+esc(unitTxt(a.unit))+'</small></div><div class="ttl">'+esc(a.title)+'</div><div class="meta"><span>'+esc(a.city)+'</span><span>'+esc(ago(a.ts))+'</span></div>'+(a.sold?'<span class="badge">'+esc(t('sold'))+'</span>':'')+'</div>'+
      '<div class="acts"><button type="button" class="lnk" data-act="open" data-v="'+a.id+'">'+esc(t('details'))+'</button><button type="button" class="lnk" data-act="edit" data-v="'+a.id+'">'+esc(t('edit'))+'</button><button type="button" class="lnk" data-act="sold" data-v="'+a.id+'">'+esc(a.sold?t('markLive'):t('markSold'))+'</button><button type="button" class="lnk danger" data-act="del" data-v="'+a.id+'">'+esc(conf?t('confirmDel'):t('del'))+'</button></div></div>';
   }).join(''):'<div class="empty"><p>'+esc(t('noAds'))+'</p><button type="button" class="btn btn-primary" data-act="nav" data-v="sell">'+esc(t('postAd'))+'</button></div>')+'</main>';
}

function savedView(){
  var ids=mySaved(),l=ids.map(adById).filter(Boolean);
  return subBar(t('navSaved'),'home')+'<main class="pad" style="padding-block:14px">'+
   (l.length?'<div class="grid">'+l.map(cardHTML).join('')+'</div>':'<div class="empty"><h3>'+esc(t('noSaved'))+'</h3><p>'+esc(t('noSavedHint'))+'</p></div>')+'</main>';
}

var IC={
 box:'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.500 8L12 4l8.500 4v8.500L12 20.500l-8.500-4zM3.500 8L12 12l8.500-4M12 12v8.500" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
 crown:'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17l-1.500-9 5 4L12 5l4.500 7 5-4L20 17zM4.500 20.500h15" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>',
 shop:'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.500L5.500 4h13L20 9.500M4 9.500a2.700 2.700 0 0 0 5.300 0 2.700 2.700 0 0 0 5.400 0 2.700 2.700 0 0 0 5.300 0M5.500 12v8h13v-8M10 20v-4.500h4V20" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
 gear:'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.600 5.600l2.100 2.100M16.300 16.300l2.100 2.100M5.600 18.400l2.100-2.100M16.300 7.700l2.100-2.100" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 help:'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9.500 9.500a2.500 2.500 0 1 1 3.500 2.300c-.700.400-1 1-1 1.700M12 17v.1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 globe:'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
 list:'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 4V3h6v1M8.500 10h7M8.500 14h7M8.500 17.500h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 receipt:'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>',
 card:'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.500" width="18" height="13" rx="2.500" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M7 15h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 cart:'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.500l2 11h10l2-8H7M9.500 19.500h.1M16.500 19.500h.1" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
var CHEV2='<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" style="flex:none;color:var(--muted)"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.400" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function mrow(icon,title,sub,act,v,badge){
  return'<button type="button" class="prow" data-act="'+act+'" data-v="'+v+'"><span class="ic">'+icon+'</span><span class="pt"><b>'+esc(title)+'</b><small>'+esc(sub)+'</small></span>'+(badge||'')+CHEV2+'</button>';
}
function cartIds(){var u=user();return(u&&u.cart)||[];}

function wishlistView(){
  var l=mySaved().map(adById).filter(Boolean);
  return subBar(t('wishlist'),'account')+'<main class="pad" style="padding-block:14px"><p class="note" style="margin:0 0 12px">'+esc(t('wishlistSub'))+'</p>'+
   (l.length?'<div class="grid">'+l.map(cardHTML).join('')+'</div>':'<div class="empty"><h3>'+esc(t('noSaved'))+'</h3><p>'+esc(t('noSavedHint'))+'</p></div>')+'</main>';
}

function hubView(){
  var n=cartIds().length;
  return subBar(t('invBill'),'account')+'<main class="pad" style="padding-block:14px"><div class="menu">'+
   mrow(IC.box,t('buyPkg'),t('buyPkgSub'),'nav','plans')+
   mrow(IC.list,t('myOrders'),t('myOrdersSub'),'nav','orders')+
   mrow(IC.receipt,t('invoices'),t('invoicesSub'),'nav','invoices')+
   mrow(IC.card,t('billingInfo'),t('billingSub'),'nav','billing')+
   mrow(IC.cart,t('viewCart'),t('viewCartSub'),'nav','cart',n?'<span class="badge gold">'+n+'</span>':'')+
  '</div></main>';
}

function plansView(){
  var u=user(),paid=isPaid(u),inC=cartIds();
  function li(k){return'<li>'+I.check+'<span>'+esc(t(k))+'</span></li>';}
  function card(id,price,per,feats,extra){
    var cur=(id==='free'&&!paid)||(paid&&u.plan.id===id);
    var until=(paid&&u.plan.id===id)?'<p class="note" style="margin:0">'+esc(t('validTill'))+' '+esc(fmtDate(u.plan.until))+'</p>':'';
    var btns='';
    if(id!=='free'){
      btns='<div class="two"><button type="button" class="btn '+(id==='yearly'?'btn-gold':'btn-primary')+'" data-act="buyNow" data-v="'+id+'">'+esc(paid?t('extend'):t('buyNow'))+'</button>'+
        '<button type="button" class="btn btn-ghost" data-act="toggleCart" data-v="'+id+'">'+esc(inC.indexOf(id)>-1?t('inCart'):t('addToCart'))+'</button></div>';
    }
    return'<section class="plan'+(cur?' cur':'')+'"><div class="top"><h3>'+esc(t(id))+'</h3><div class="amt">'+(price?'₹'+fmt(price)+'<small>'+esc(t(per))+'</small>':'₹0')+'</div></div>'+
     (extra||'')+'<ul>'+feats.map(li).join('')+'</ul>'+until+(cur?'<span class="badge" style="align-self:flex-start">'+esc(t('current'))+'</span>':'')+btns+'</section>';
  }
  var exp=(u.plan&&!paid)?'<div class="warn">'+esc(t('expired'))+': '+esc(t(u.plan.id))+' · '+esc(fmtDate(u.plan.until))+'</div>':'';
  return subBar(t('buyPkg'),'hub')+'<main class="pad" style="padding-block:14px"><p class="note" style="margin:0 0 12px">'+esc(t('buyPkgSub'))+'</p>'+exp+
   card('free',0,'',['f_ads3'])+
   card('monthly',PRODUCTS.monthly.price,'perMonth',['f_unlimited','f_featured','f_photo'])+
   card('yearly',PRODUCTS.yearly.price,'perYear',['f_unlimited','f_featured','f_photo'],'<div><span class="badge gold">'+esc(t('save37'))+'</span> <span class="note">'+esc(t('eq'))+'</span></div>')+'</main>';
}

function ordersView(){
  var u=user(),all=(u.orders||[]).slice().sort(function(a,b){return b.ts-a.ts;});
  var tabs=[['active','tabActive'],['scheduled','tabScheduled'],['expired','tabExpired']];
  var tb='<div class="tabs t3" role="tablist">'+tabs.map(function(p){
    var c=all.filter(function(o){return orderStatus(o)===p[0];}).length;
    return'<button type="button" role="tab" data-act="ordTab" data-v="'+p[0]+'" aria-selected="'+(ui.ordTab===p[0])+'">'+esc(t(p[1]))+' ('+c+')</button>';
  }).join('')+'</div>';
  var l=all.filter(function(o){return orderStatus(o)===ui.ordTab;});
  return subBar(t('myOrders'),'hub')+'<main class="pad" style="padding-block:14px">'+tb+
   (l.length?l.map(function(o){
     return'<div class="ord"><div class="top"><b>'+esc(pName(o.product))+'</b><b class="invbox">₹'+fmt(o.price)+'</b></div>'+
      '<div class="note" style="margin:0">'+esc(t('validity'))+': '+esc(fmtDate(o.start))+' – '+esc(fmtDate(o.until))+'</div>'+
      '<div class="note" style="margin:0">'+esc(t('order'))+' '+esc(o.no)+'</div>'+(o.pay?'<div class="note" style="margin:0">'+esc(t('paidVia'))+': '+esc(payLabel(o.pay))+'</div>':'')+'</div>';
   }).join(''):'<div class="empty"><p>'+esc(t('noOrders'))+'</p></div>')+'</main>';
}

function invoicesView(){
  var all=(user().orders||[]).slice().sort(function(a,b){return b.ts-a.ts;});
  return subBar(t('invoices'),'hub')+'<main class="pad" style="padding-block:14px">'+
   (all.length?'<div class="menu">'+all.map(function(o){return mrow(IC.receipt,t('invoice')+' '+o.no,fmtDate(o.ts)+' · ₹'+fmt(o.price),'openInv',o.id);}).join('')+'</div>':'<div class="empty"><p>'+esc(t('noInvoices'))+'</p></div>')+'</main>';
}

function invoiceView(){
  var o=orderById(ui.invId);if(!o)return invoicesView();
  var u=user(),b=u.billing||{};
  var cs=[b.city,b.state,b.pin].filter(Boolean).join(', ');
  return subBar(t('invoice')+' '+o.no,'invoices')+'<main class="pad" style="padding-block:14px"><div class="panel invbox" style="margin-top:0">'+
   '<div class="phead" style="margin-bottom:8px"><h2>Kabadiwala<span style="color:var(--accent)">.com</span></h2></div>'+
   '<dl class="kv"><dt>'+esc(t('invoice'))+'</dt><dd>'+esc(o.no)+'</dd><dt>'+esc(t('invDate'))+'</dt><dd>'+esc(fmtDate(o.ts))+'</dd></dl><hr class="d" style="margin-block:12px">'+
   '<div class="note" style="margin:0">'+esc(t('billedTo'))+'</div><b style="overflow-wrap:anywhere">'+esc(b.name||u.shop)+'</b>'+
   (b.addr?'<div style="overflow-wrap:anywhere">'+esc(b.addr)+'</div>':'')+(cs?'<div>'+esc(cs)+'</div>':'')+(b.gst?'<div>GSTIN '+esc(b.gst)+'</div>':'')+
   '<hr class="d" style="margin-block:12px">'+
   '<div class="sum"><span>'+esc(pName(o.product))+'<br><small style="color:var(--muted)">'+esc(fmtDate(o.start))+' – '+esc(fmtDate(o.until))+'</small></span><b>₹'+fmt(o.price)+'</b></div>'+
   '<div class="sum" style="border:0"><span>'+esc(t('cartTotal'))+'</span><b style="font-size:20px">₹'+fmt(o.price)+'</b></div>'+
   (o.pay?'<p class="note">'+esc(t('paidVia'))+': '+esc(payLabel(o.pay))+'</p>':'')+'<p class="note">'+esc(t('noTax'))+'</p></div>'+
   '<button type="button" class="btn btn-primary block" style="margin-top:14px" data-act="dlInv" data-v="'+o.id+'">'+esc(t('downloadInv'))+'</button></main>';
}

function billingView(){
  var u=user(),b=u.billing||{name:u.shop,addr:'',city:u.city||'',state:'',pin:'',gst:''};
  function f(id,label,val,extra){return'<div class="fld"><label for="'+id+'">'+esc(label)+'</label><input id="'+id+'" type="text" value="'+esc(val||'')+'" '+(extra||'')+'></div>';}
  return subBar(t('billingInfo'),'hub')+'<main class="pad" style="padding-block:14px"><form id="f-billing" novalidate>'+
   f('b-name',t('billName'),b.name,'autocomplete="name"')+f('b-addr',t('billAddr'),b.addr,'autocomplete="street-address"')+
   '<div class="two">'+f('b-city',t('billCity'),b.city,'autocomplete="address-level2"')+f('b-state',t('billState'),b.state,'autocomplete="address-level1"')+'</div>'+
   '<div class="two">'+f('b-pin',t('billPin'),b.pin,'inputmode="numeric" maxlength="6" autocomplete="postal-code"')+f('b-gst',t('billGst'),b.gst,'maxlength="15" autocapitalize="characters"')+'</div>'+
   errLine()+'<button class="btn btn-primary block" type="submit">'+esc(t('saveBilling'))+'</button></form></main>';
}

function cartView(){
  var ids=cartIds(),total=0;
  if(!ids.length)return subBar(t('viewCart'),'hub')+'<main class="pad" style="padding-block:14px"><div class="empty"><h3>'+esc(t('cartEmpty'))+'</h3><p>'+esc(t('cartEmptyHint'))+'</p><button type="button" class="btn btn-primary" data-act="nav" data-v="plans">'+esc(t('buyPkg'))+'</button></div></main>';
  var rows=ids.map(function(id){
    total+=PRODUCTS[id].price;
    return'<div class="ord"><div class="top"><b>'+esc(pName(id))+'</b><b class="invbox">₹'+fmt(PRODUCTS[id].price)+'</b></div><div class="note" style="margin:0">'+PRODUCTS[id].days+' '+esc(t('days30').replace('/30 ',''))+'</div>'+
     '<button type="button" class="lnk danger" style="align-self:flex-start;padding:0" data-act="rmCart" data-v="'+id+'">'+esc(t('remove'))+'</button></div>';
  }).join('');
  return subBar(t('viewCart'),'hub')+'<main class="pad" style="padding-block:14px">'+rows+
   '<div class="sum" style="border:0"><span>'+esc(t('cartTotal'))+'</span><b style="font-size:20px">₹'+fmt(total)+'</b></div>'+
   '<button type="button" class="btn btn-primary block" data-act="checkout">'+esc(t('checkout'))+' · ₹'+fmt(total)+'</button></main>';
}

function eliteView(prod){
  var u=user(),isB=prod==='eliteBuyer',key=PRODUCTS[prod].kind,active=eActive(u,key);
  var feats=isB?['eb_f1','eb_f2']:['es_f1','es_f2','es_f3'];
  var inC=cartIds().indexOf(prod)>-1;
  return subBar(t(isB?'eliteBuyer':'eliteSeller'),'account')+'<main class="pad" style="padding-block:14px">'+
   '<section class="plan'+(active?' cur':'')+'"><div class="top"><h3>'+esc(t(isB?'eliteBuyerName':'eliteSellerName'))+'</h3><div class="amt">₹'+fmt(PRODUCTS[prod].price)+'<small>'+esc(t('days30'))+'</small></div></div>'+
   '<p class="note" style="margin:0">'+esc(t(isB?'eliteBuyerSub':'eliteSellerSub'))+'</p>'+
   '<ul>'+feats.map(function(k){return'<li>'+I.check+'<span>'+esc(t(k))+'</span></li>';}).join('')+'</ul>'+
   (active?'<span class="badge gold" style="align-self:flex-start">'+esc(t('eliteActive'))+' '+esc(fmtDate(u.elite[key]))+'</span>':'')+
   '<div class="two"><button type="button" class="btn btn-gold" data-act="buyNow" data-v="'+prod+'">'+esc(active?t('extend'):t('buyNow'))+'</button>'+
   '<button type="button" class="btn btn-ghost" data-act="toggleCart" data-v="'+prod+'">'+esc(inC?t('inCart'):t('addToCart'))+'</button></div></section></main>';
}

function settingsView(){
  var u=user();
  return subBar(t('settings'),'account')+'<main class="pad" style="padding-block:14px">'+
   '<h2 style="font-size:20px;margin-bottom:10px">'+esc(t('privacy'))+'</h2>'+
   '<label class="chk" for="s-hide"><input id="s-hide" type="checkbox"'+(u.hidePhone?' checked':'')+'><span><b>'+esc(t('hidePhone'))+'</b><br><small style="color:var(--muted)">'+esc(t('hidePhoneHint'))+'</small></span></label>'+
   '<p class="note">'+esc(t('privacyNote'))+'</p>'+
   '<div class="stack" style="margin-top:18px"><button type="button" class="btn btn-ghost block" data-act="logout">'+esc(t('logout'))+'</button></div></main>';
}

function helpView(){
  var faq=[1,2,3,4].map(function(n){return'<details class="faq"><summary>'+esc(t('faq'+n+'q'))+'</summary><p>'+esc(t('faq'+n+'a'))+'</p></details>';}).join('');
  return subBar(t('helpSupport'),'account')+'<main class="pad" style="padding-block:14px">'+
   '<h2 style="font-size:20px;margin-bottom:10px">'+esc(t('helpCentre'))+'</h2>'+faq+
   '<h2 style="font-size:20px;margin-block:20px 10px">'+esc(t('legal'))+'</h2>'+
   '<details class="faq"><summary>'+esc(t('terms'))+'</summary><p>'+esc(t('termsTxt'))+'</p></details>'+
   '<details class="faq"><summary>'+esc(t('privPol'))+'</summary><p>'+esc(t('privTxt'))+'</p></details>'+
   '<p class="note">'+esc(t('legalDemo'))+'</p></main>';
}

function languageView(){
  var l=[['en','English'],['or','ଓଡ଼ିଆ'],['hi','हिन्दी']];
  return subBar(t('selectLang'),'account')+'<main class="pad" style="padding-block:14px">'+l.map(function(p){
    return'<button type="button" class="lrow" data-act="lang" data-v="'+p[0]+'" aria-pressed="'+(lang===p[0])+'"><span>'+p[1]+'</span>'+(lang===p[0]?I.check:'')+'</button>';
  }).join('')+'</main>';
}


var KW=window.KW_CONFIG||{};
var BANKS=['State Bank of India','HDFC Bank','ICICI Bank','Axis Bank','Punjab National Bank','Bank of Baroda','Kotak Mahindra Bank','Canara Bank','Union Bank of India','IndusInd Bank','Yes Bank','IDFC First Bank','Bank of India','Central Bank of India','Indian Bank','UCO Bank'];
var WALLETS=['Paytm','PhonePe','Amazon Pay','MobiKwik','Freecharge'];
var UPI_APPS=['Google Pay','PhonePe','Paytm','BHIM','Amazon Pay'];
var PM_ICON={
 upi:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h10v18H7z"/><path d="M10 17h4M9 7l3 3 3-3"/></svg>',
 card:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="2.500" y="5" width="19" height="14" rx="2"/><path d="M2.500 10h19M6 15h4"/></svg>',
 netbank:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-5 9 5M5 10v8M9.500 10v8M14.500 10v8M19 10v8M3 20h18"/></svg>',
 wallet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z"/><circle cx="16.500" cy="14.500" r="1"/></svg>'};
function cardNet(n){
  n=String(n||'').replace(/\D/g,'');
  if(/^4/.test(n))return'Visa';
  if(/^(5[1-5]|2(2[2-9][1-9]|2[3-9]|[3-6]|7[01]|720))/.test(n))return'Mastercard';
  if(/^3[47]/.test(n))return'American Express';
  if(/^(60|65|81|82|508)/.test(n))return'RuPay';
  return'';
}
function luhn(n){
  var s=0,alt=false;
  for(var i=n.length-1;i>=0;i--){var d=+n.charAt(i);if(alt){d*=2;if(d>9)d-=9;}s+=d;alt=!alt;}
  return n.length>=13&&n.length<=19&&s%10===0;
}
function fmtCard(v){
  var d=String(v).replace(/\D/g,'').slice(0,19);
  if(/^3[47]/.test(d)){d=d.slice(0,15);return[d.slice(0,4),d.slice(4,10),d.slice(10)].filter(Boolean).join(' ');}
  return d.replace(/(.{4})/g,'$1 ').trim();
}
function fmtExp(v){var d=String(v).replace(/\D/g,'').slice(0,4);return d.length>2?d.slice(0,2)+'/'+d.slice(2):d;}
function expOk(v){
  var m=/^(\d{2})\/(\d{2})$/.exec(v);if(!m)return false;
  var mo=+m[1],yr=2000+ +m[2];if(mo<1||mo>12)return false;
  var now=new Date();return yr>now.getFullYear()||(yr===now.getFullYear()&&mo>=now.getMonth()+1);
}
function payLabel(p){
  if(!p)return'';
  return({upi:'UPI',card:t('pmCard'),netbank:t('pmNet'),wallet:t('pmWallet'),razorpay:'Razorpay'})[p.m]+' · '+p.d;
}
function pmHead(id,title,sub){
  var on=ui.payM===id;
  return'<button type="button" class="pm-h" data-act="payM" data-v="'+id+'" aria-pressed="'+on+'"><span class="rd"></span>'+PM_ICON[id]+'<span style="flex:1;min-width:0"><b>'+esc(title)+'</b><small>'+esc(sub)+'</small></span></button>';
}
function pmPanel(){
  var m=ui.payM,h='';
  if(m==='upi'){
    h='<div class="tiles">'+UPI_APPS.map(function(a){return'<button type="button" class="tile" data-act="upiApp" data-v="'+esc(a)+'" aria-pressed="'+(ui.upiApp===a)+'">'+esc(a)+'</button>';}).join('')+'</div>'+
      fld('p-upi',t('upiId'),'text','off','placeholder="name@bank" autocapitalize="none" spellcheck="false" inputmode="email"');
  }else if(m==='card'){
    h=fld('c-num',t('cardNo'),'text','off','inputmode="numeric" placeholder="0000 0000 0000 0000" maxlength="23"')+'<div class="cardnet" id="c-net"></div>'+
      fld('c-name',t('cardName'),'text','off','placeholder="'+esc(t('cardNameHint'))+'" autocapitalize="characters"')+
      '<div class="two">'+fld('c-exp',t('cardExp'),'text','off','inputmode="numeric" placeholder="MM/YY" maxlength="5"')+fld('c-cvv',t('cardCvv'),'password','off','inputmode="numeric" placeholder="•••" maxlength="4"')+'</div>';
  }else if(m==='netbank'){
    h='<div class="fld"><label for="p-bank">'+esc(t('pickBank'))+'</label><select id="p-bank"><option value="">'+esc(t('pickBank'))+'</option>'+BANKS.map(function(b){return'<option value="'+esc(b)+'">'+esc(b)+'</option>';}).join('')+'</select></div>';
  }else{
    h='<div class="tiles" role="group" aria-label="'+esc(t('pmWallet'))+'">'+WALLETS.map(function(w){return'<button type="button" class="tile" data-act="wallet" data-v="'+esc(w)+'" aria-pressed="'+(ui.wallet===w)+'">'+esc(w)+'</button>';}).join('')+'</div>';
  }
  return'<div class="pm-p">'+h+'</div>';
}

function payView(){
  var ids=ui.checkout||[],total=0;
  if(!ids.length)return hubView();
  var rows=ids.map(function(id){total+=PRODUCTS[id].price;return'<div class="sum"><span>'+esc(pName(id))+'</span><b>₹'+fmt(PRODUCTS[id].price)+'</b></div>';}).join('');
  return subBar(t('payTitle'),ui.payFrom||'plans')+'<main class="pad" style="padding-block:14px">'+
   '<div class="panel" style="margin-top:0"><h3 style="font-size:16px;margin-bottom:6px">'+esc(t('summary'))+'</h3>'+rows+'<div class="sum" style="border:0"><span>'+esc(t('total'))+'</span><b style="font-size:20px">₹'+fmt(total)+'</b></div></div>'+
   (KW.razorpayKey?'':'<div class="warn">'+esc(t('demoNote'))+'</div>')+
   '<form id="f-pay" novalidate>'+(KW.razorpayKey?'<div class="panel" style="margin-top:0"><h3 style="font-size:16px;margin-bottom:4px">'+esc(t('payRzp'))+'</h3><p class="note" style="margin:0">'+esc(t('payRzpSub'))+'</p></div>':'<div class="pm" role="radiogroup" aria-label="'+esc(t('payMethod'))+'">'+
     pmHead('upi',t('pmUpi'),t('pmUpiSub'))+(ui.payM==='upi'?pmPanel():'')+
     pmHead('card',t('pmCard'),t('pmCardSub'))+(ui.payM==='card'?pmPanel():'')+
     pmHead('netbank',t('pmNet'),t('pmNetSub'))+(ui.payM==='netbank'?pmPanel():'')+
     pmHead('wallet',t('pmWallet'),t('pmWalletSub'))+(ui.payM==='wallet'?pmPanel():'')+'</div>')+
    (KW.razorpayKey?'':'<p class="secure">'+esc(t('payDemoSafe'))+'</p>')+errLine()+
    '<button class="btn btn-primary block" type="submit"'+(ui.paying?' disabled':'')+'>'+(ui.paying?'<span class="spin" aria-hidden="true"></span> '+esc(t('processing')):esc(t('payNow'))+' ₹'+fmt(total))+'</button></form></main>';
}

var CCS=['+91','+1','+44','+971','+977','+880','+94'];
var CHEV='<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" style="flex:none;color:var(--muted)"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var MSG='<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.500h16v10.500H9l-5 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
var CALL='<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.500 3.500h3l1.500 4-2 1.500a11 11 0 0 0 6 6l1.500-2 4 1.500v3a2 2 0 0 1-2 2A15.500 15.500 0 0 1 4.500 5.500a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';

function avatar(o,size){
  var sz=size||64;
  if(o.photo)return'<span class="avl" style="width:'+sz+'px;height:'+sz+'px;background-image:url('+esc(o.photo)+')" aria-hidden="true"></span>';
  return'<span class="avl" style="width:'+sz+'px;height:'+sz+'px;font-size:'+Math.round(sz*0.42)+'px" aria-hidden="true">'+esc((Array.from((o.name||o.shop||'?').trim())[0]||'?').toUpperCase())+'</span>';
}
function readImg(file,max,cb){
  var rd=new FileReader();
  rd.onload=function(){
    var img=new Image();
    img.onload=function(){
      var r=Math.min(1,max/Math.max(img.width,img.height));
      var c=document.createElement('canvas');c.width=Math.round(img.width*r);c.height=Math.round(img.height*r);
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      cb(c.toDataURL('image/jpeg',0.75));
    };
    img.src=rd.result;
  };
  rd.readAsDataURL(file);
}
function canSave(){var d=ui.draft;return!!(d&&d.name.trim()&&d.phoneV&&(!d.email||d.emailV));}
function refreshSave(){
  var ok=canSave(),b=root.querySelector('.sbtn'),h=document.getElementById('savehint');
  if(b)b.disabled=!ok;if(h)h.hidden=ok;
}

function accountView(){
  var u=user(),eb=eActive(u,'eb'),es=eActive(u,'es');
  var on='<span class="badge gold">'+esc(t('tabActive'))+'</span>';
  return subBar(t('myAccount'),'home')+'<main class="pad" style="padding-block:14px">'+
   '<button type="button" class="prow" data-act="nav" data-v="profile">'+avatar(u,52)+'<span class="pt"><b>'+esc(u.name)+'</b><small>'+esc(t('viewEdit'))+'</small></span>'+CHEV+'</button>'+
   '<div class="menu" style="margin-top:14px">'+
    mrow(IC.box,t('pkgOrders'),t('pkgOrdersSub'),'nav','hub')+
    mrow(I.heartO,t('wishlist'),t('wishlistSub'),'nav','wishlist')+
    mrow(IC.crown,t('eliteBuyer'),t('eliteBuyerSub'),'nav','ebuyer',eb?on:'')+
    mrow(IC.shop,t('eliteSeller'),t('eliteSellerSub'),'nav','eseller',es?on:'')+
    mrow(IC.gear,t('settings'),t('settingsSub'),'nav','settings')+
    mrow(IC.help,t('helpSupport'),t('helpSub'),'nav','help')+
    mrow(IC.globe,t('selectLang'),t('langSub'),'nav','language')+
   '</div><p class="note">'+esc(t('localNote'))+'</p></main>';
}

function profileView(){
  var u=user(),info='';
  if(ui.showInfo==='call')info=u.mobile?(u.cc||'+91')+' '+u.mobile+(u.mobileV?' · '+t('mobileVerified'):''):t('noMobile');
  if(ui.showInfo==='msg')info=u.email?u.email+(u.emailV?' · '+t('emailVerified'):''):t('noEmail');
  return subBar(t('viewEdit'),'account')+'<main class="pad" style="padding-block:14px"><div class="panel" style="margin-top:0">'+
   '<div class="pr-top">'+avatar(u,76)+'<div class="pt"><h2 style="font-size:22px;overflow-wrap:anywhere">'+esc(u.name)+'</h2></div></div>'+
   '<p class="note" style="margin:12px 0 0">'+esc(t('memberSince'))+' '+esc(fmtDate(u.created))+'</p>'+
   '<p style="margin:10px 0 0;overflow-wrap:anywhere;white-space:pre-wrap">'+(u.about?esc(u.about):'<span class="note">'+esc(t('noAbout'))+'</span>')+'</p>'+
   '<div class="ico-row"><button type="button" class="ibtn2" data-act="info" data-v="msg" aria-pressed="'+(ui.showInfo==='msg')+'" aria-label="'+esc(t('message'))+'">'+MSG+'</button>'+
   '<button type="button" class="ibtn2" data-act="info" data-v="call" aria-pressed="'+(ui.showInfo==='call')+'" aria-label="'+esc(t('call'))+'">'+CALL+'</button></div>'+
   (info?'<p class="note" style="margin:10px 0 0;overflow-wrap:anywhere" role="status">'+esc(info)+'</p>':'')+
   '<button type="button" class="btn btn-navy block" style="margin-top:16px" data-act="editProfile">'+esc(t('editProfile'))+'</button></div></main>';
}

function editView(){
  var d=ui.draft;if(!d)return profileView();
  var ok=canSave();
  var ccOpts=CCS.map(function(c){return'<option value="'+c+'"'+(d.cc===c?' selected':'')+'>'+c+'</option>';}).join('');
  return subBar(t('editProfile'),'profile')+'<main class="pad" style="padding-block:14px"><div class="panel" style="margin-top:0">'+
   '<div class="phead"><h2>'+esc(t('basicInfo'))+'</h2><button type="button" class="btn btn-primary sbtn" data-act="saveProfile"'+(ok?'':' disabled')+'>'+esc(t('save'))+'</button></div>'+
   '<div class="pic-row">'+avatar(d,84)+'<div class="grow"><label for="e-photo" style="font-weight:600;font-size:13px;color:var(--muted)">'+esc(t('selectPic'))+'</label><input id="e-photo" type="file" accept="image/*">'+
    (d.photo?'<button type="button" class="lnk danger" style="align-self:flex-start;padding:0" data-act="rmEPhoto">'+esc(t('removePic'))+'</button>':'')+'</div></div>'+
   '<div class="fld"><label for="e-name">'+esc(t('yourName'))+'</label><input id="e-name" type="text" maxlength="60" autocomplete="name" placeholder="'+esc(t('enterName'))+'" value="'+esc(d.name)+'"></div>'+
   '<div class="fld"><label for="e-about">'+esc(t('aboutYou'))+'</label><textarea id="e-about" maxlength="200" placeholder="'+esc(t('aboutPh'))+'">'+esc(d.about)+'</textarea><div class="note" style="text-align:right;margin:0"><span id="e-count">'+d.about.length+'</span>/200</div></div>'+
   '<p id="savehint" class="note" style="margin:0"'+(ok?' hidden':'')+'>'+esc(t('needFix'))+'</p>'+
   '<hr class="d"><h2 style="font-size:20px;margin-bottom:14px">'+esc(t('contactInfo'))+'</h2>'+
   '<div class="fld" style="margin-bottom:6px"><span style="font-weight:600;font-size:13px;color:var(--muted)">'+esc(t('mobileNo'))+'</span>'+
    '<div class="cc-row"><select id="e-cc" aria-label="'+esc(t('countryCode'))+'">'+ccOpts+'</select>'+
    '<button type="button" class="fake'+(d.phone?'':' empty0')+'" data-act="openVerify" data-v="phone">'+esc(d.phone||t('enterMobile'))+'</button></div></div>'+
   (d.phoneV?'<p class="ok">'+I.check+'<span>'+esc(t('mobileVerified'))+'</span></p>':(d.phone?'<p class="bad">'+esc(t('notVerified'))+'</p>':''))+
   '<div class="fld" style="margin-top:14px;margin-bottom:6px"><span style="font-weight:600;font-size:13px;color:var(--muted)">'+esc(t('emailId'))+'</span>'+
    '<button type="button" class="fake'+(d.email?'':' empty0')+'" data-act="openVerify" data-v="email"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(d.email||t('enterEmail'))+'</span></button></div>'+
   (d.emailV&&d.email?'<p class="ok">'+I.check+'<span>'+esc(t('emailVerified'))+'</span></p>':(d.email?'<p class="bad">'+esc(t('notVerified'))+'</p>':''))+
   (d.email?'<button type="button" class="lnk danger" style="padding:0" data-act="clearEmail">'+esc(t('removeEmail'))+'</button>':'')+
  '</div></main>';
}

function verifyModal(){
  var v=ui.verify;if(!v)return'';
  var ph=v.kind==='phone';
  var ccOpts=CCS.map(function(c){return'<option value="'+c+'"'+(v.cc===c?' selected':'')+'>'+c+'</option>';}).join('');
  var field=ph?
    '<div class="cc-row"><div class="fld"><label for="v-cc">'+esc(t('countryCode'))+'</label><select id="v-cc"'+(v.sent?' disabled':'')+'>'+ccOpts+'</select></div>'+
    '<div class="fld"><label for="v-val">'+esc(t('mobileNo'))+'</label><input id="v-val" type="tel" inputmode="numeric" maxlength="12" autocomplete="tel-national" value="'+esc(v.value)+'"'+(v.sent?' readonly':'')+'></div></div>':
    '<div class="fld"><label for="v-val">'+esc(t('emailId'))+'</label><input id="v-val" type="email" autocomplete="email" autocapitalize="none" spellcheck="false" value="'+esc(v.value)+'"'+(v.sent?' readonly':'')+'></div>';
  return'<div class="scrim" data-act="closeVerify"></div><div class="sheet pad" role="dialog" aria-modal="true" aria-label="'+esc(ph?t('verifyPhone'):t('verifyEmail'))+'">'+
   '<div class="phead"><h2>'+esc(ph?t('verifyPhone'):t('verifyEmail'))+'</h2><button type="button" class="ibtn" style="color:var(--ink)" data-act="closeVerify" aria-label="'+esc(t('close'))+'"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button></div>'+
   '<p class="note" style="margin:0 0 12px;font-size:14px">'+esc(ph?t('enterPhoneToVerify'):t('enterEmailToVerify'))+'</p>'+
   field+
   (v.sent?'<button type="button" class="lnk" style="padding:0;margin:-6px 0 10px" data-act="changeVal">'+esc(t('change'))+'</button><div class="warn" style="margin-top:0">'+esc(t('otpDemo'))+' <b>'+esc(v.otp)+'</b></div>'+
     '<div class="fld"><label for="v-otp">'+esc(t('enterOtp'))+'</label><input id="v-otp" type="text" inputmode="numeric" maxlength="6" autocomplete="one-time-code"></div>':'')+
   errLine()+
   '<div class="stack"><button type="button" class="btn btn-ghost block" data-act="reqOtp">'+esc(t('requestOtp'))+'</button>'+
   '<button type="button" class="btn btn-primary block" data-act="verifyNext"'+(v.sent?'':' disabled')+'>'+esc(t('next'))+'</button></div></div>';
}

function navView(){
  var accV=['pay','plans','profile','editprofile','hub','orders','invoices','invoice','billing','cart','ebuyer','eseller','wishlist','settings','help','language'];
  var cur=accV.indexOf(ui.view)>-1?'account':(({detail:ui.prev||'home',edit:'sell'})[ui.view]||ui.view);
  function b(v,icon,label){return'<button type="button" data-act="nav" data-v="'+v+'"'+(cur===v?' aria-current="page"':'')+'>'+icon+'<span>'+esc(label)+'</span></button>';}
  return'<nav class="nav" aria-label="Main">'+b('home',I.home,t('navHome'))+b('saved',I.heartO,t('navSaved'))+
   '<button type="button" class="sell" data-act="nav" data-v="sell"><i>'+I.plus+'</i><span>'+esc(t('sell'))+'</span></button>'+
   b('ads',I.ads,t('navAds'))+b('account',I.acct,t('navAccount'))+'</nav>';
}

function shell(){
  if(!user()||ui.view==='auth')return authView();
  var v=ui.view;
  var body={home:homeView,detail:detailView,sell:sellView,ads:adsView,saved:savedView,plans:plansView,pay:payView,account:accountView,profile:profileView,editprofile:editView,hub:hubView,orders:ordersView,invoices:invoicesView,invoice:invoiceView,billing:billingView,cart:cartView,ebuyer:function(){return eliteView('eliteBuyer');},eseller:function(){return eliteView('eliteSeller');},wishlist:wishlistView,settings:settingsView,help:helpView,language:languageView,location:locationView}[v]||homeView;
  return body()+(v==='detail'||v==='sell'||v==='pay'||v==='editprofile'?'':navView())+verifyModal()+brandModal()+catModal()+delModal();
}

/* ---------- render ---------- */
function render(keep){
  var snap={},focusId=document.activeElement&&document.activeElement.id;
  if(keep){root.querySelectorAll('input,select,textarea').forEach(function(el){if(el.id&&el.type!=='file')snap[el.id]=el.value;});}
  document.documentElement.lang=lang;
  root.innerHTML=shell();
  if(keep){
    Object.keys(snap).forEach(function(id){var el=document.getElementById(id);if(el)el.value=snap[id];});
    if(focusId){var f=document.getElementById(focusId);if(f&&f.focus)try{f.focus();}catch(e){}}
  }
}
function go(view){
  if(view==='home'||view==='saved'||view==='ads'||view==='account')ui.prev=view;
  ui.view=view;ui.errKey='';ui.confirmDel=null;ui.phoneShown=false;ui.verify=null;ui.showInfo='';ui.addBrand=null;ui.addCatM=null;ui.delM=null;if(view==='location'){ui.locState='';ui.locQ='';}
  if(view!=='sell'){ui.editId=null;ui.photo=null;}
  if(view!=='pay')ui.paying=false;
  if(view!=='editprofile')ui.draft=null;
  render(false);window.scrollTo(0,0);
}
var toastTimer=null;
function toast(msg){
  var el=document.getElementById('toast');if(!el)return;
  el.textContent=msg;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(function(){el.hidden=true;},2600);
}
function fail(k){ui.errKey=k;render(true);}
function val(id){var el=document.getElementById(id);return el?el.value.trim():'';}

/* ---------- actions ---------- */
function doSignup(){
  var name=val('a-name'),shop=val('a-shop'),city=val('a-city'),phone=val('a-phone'),pw=document.getElementById('a-pass').value;
  if(!name||!shop)return fail('errName');
  if(!/^\d{10}$/.test(phone))return fail('errPhone');
  if(pw.length<6)return fail('errPass');
  if(S.users[phone])return fail('errExists');
  hash(phone,pw).then(function(h){
    S.users[phone]={name:name,shop:shop,city:city,hash:h,plan:null,created:Date.now()};
    S.session=phone;persist();go('home');
  });
}
function doLogin(){
  var phone=val('a-phone'),pw=document.getElementById('a-pass').value;
  if(!/^\d{10}$/.test(phone))return fail('errPhone');
  if(!S.users[phone])return fail('errNoUser');
  hash(phone,pw).then(function(h){
    if(S.users[phone].hash!==h)return fail('errWrongPass');
    S.session=phone;persist();go('home');
  });
}
function doDemo(){
  var phone='9000000000';
  if(!S.users[phone])S.users[phone]={name:'Demo',shop:'Demo Kabadi Shop',city:'Bhubaneswar',hash:'demo',plan:null,created:Date.now()};
  S.session=phone;persist();go('home');
}
function doSaveAd(){
  var cat=val('d-cat'),brand=val('d-brand')||'__other',title=val('d-title'),price=parseFloat(val('d-price')),unit=val('d-unit'),qty=parseFloat(val('d-qty'))||0,city=val('d-city-sel'),state=val('d-state'),desc=val('d-desc');
  if(city==='__other')city=val('d-city');
  if(!title||!(price>0)||!city||!state)return fail('errAd');
  if(cat==='__newcat'){var ncn=val('d-newcat');if(!ncn)return fail('errCat');cat=addCategory(ncn);}
  if(brand==='__new'){var nbn=val('d-newbrand');if(!nbn)return fail('errBrand');brand=addBrand(cat,nbn);}
  var paid=canPost(user());
  if(ui.editId){
    var a=adById(ui.editId);
    if(a){a.cat=cat;a.brand=brand;a.title=title;a.price=price;a.unit=unit;a.qty=qty;a.city=city;a.state=state;a.desc=desc;a.photo=ui.photo;a.feat=paid;}
    persist();toast(t('updated'));go('ads');return;
  }
  var live=myAds().filter(function(x){return!x.sold;}).length;
  if(!paid&&live>=FREE_ADS)return go('plans');
  S.ads.push({id:uid(),owner:S.session,sellerName:user().shop,cat:cat,brand:brand,title:title,price:price,unit:unit,qty:qty,city:city,state:state,desc:desc,photo:ui.photo,sold:false,feat:paid,ts:Date.now()});
  persist();toast(t('published'));go('home');
}
function finishPay(info){
  var u=user(),ids=ui.checkout||[];if(!u||!ids.length){ui.paying=false;return;}
  ids.forEach(function(id){applyProduct(u,id,info);});
  u.cart=(u.cart||[]).filter(function(x){return ids.indexOf(x)<0;});
  if(canPost(u))myAds().forEach(function(a){a.feat=true;});
  persist();ui.paying=false;ui.checkout=[];ui.payM='upi';ui.upiApp='';ui.wallet='';ui.ordTab='active';go('orders');toast(t('paid'));
}
function loadRzp(cb){
  if(window.Razorpay)return cb(true);
  var s=document.createElement('script');s.src='https://checkout.razorpay.com/v1/checkout.js';
  s.onload=function(){cb(true);};s.onerror=function(){cb(false);};document.head.appendChild(s);
}
function doRazorpay(){
  var ids=ui.checkout||[],total=0,u=user();
  ids.forEach(function(id){total+=PRODUCTS[id].price;});
  ui.paying=true;ui.errKey='';render(true);
  var done=false;
  function stop(k){if(done)return;done=true;ui.paying=false;ui.errKey=k;render(true);}
  function verify(r){
    if(!KW.verifyUrl){done=true;finishPay({m:'razorpay',d:r.razorpay_payment_id});return;}
    fetch(KW.verifyUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(r)})
      .then(function(x){return x.json();})
      .then(function(v){if(v&&v.ok){done=true;finishPay({m:'razorpay',d:r.razorpay_payment_id});}else{done=false;stop('payVerifyFail');}})
      .catch(function(){done=false;stop('payVerifyFail');});
  }
  function open(orderId){
    loadRzp(function(ok){
      if(!ok)return stop('rzpLoad');
      var opt={key:KW.razorpayKey,amount:total*100,currency:'INR',name:'Kabadiwala.com',description:ids.map(pName).join(', '),
        prefill:{name:u.name||u.shop||'',contact:u.mobile||S.session||''},theme:{color:'#D9480F'},
        handler:function(r){verify(r);},
        modal:{ondismiss:function(){stop('rzpFail');}}};
      if(orderId)opt.order_id=orderId;
      try{var rz=new window.Razorpay(opt);rz.on('payment.failed',function(){stop('rzpFail');});rz.open();}catch(e){stop('rzpLoad');}
    });
  }
  if(KW.orderUrl){
    fetch(KW.orderUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:ids,amount:total})})
      .then(function(r){return r.json();}).then(function(o){if(!o||!o.id)throw 0;open(o.id);}).catch(function(){stop('rzpLoad');});
  }else open('');
}
function doPay(){
  if(KW.razorpayKey)return doRazorpay();
  var m=ui.payM,info=null;
  if(m==='upi'){
    var upi=val('p-upi');
    if(!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upi))return fail('errUpi');
    info={m:'upi',d:(ui.upiApp?ui.upiApp+' · ':'')+upi};
  }else if(m==='card'){
    var num=val('c-num').replace(/\D/g,''),nm=val('c-name'),ex=val('c-exp'),cv=val('c-cvv');
    if(!luhn(num))return fail('errCard');
    if(nm.length<2)return fail('errCardName');
    if(!expOk(ex))return fail('errExp');
    if(!new RegExp('^\\d{'+(cardNet(num)==='American Express'?4:3)+'}$').test(cv))return fail('errCvv');
    info={m:'card',d:(cardNet(num)||t('pmCard'))+' ••'+num.slice(-4)};
  }else if(m==='netbank'){
    var bk=val('p-bank');if(!bk)return fail('errBank');
    info={m:'netbank',d:bk};
  }else{
    if(!ui.wallet)return fail('errWallet');
    info={m:'wallet',d:ui.wallet};
  }
  ui.paying=true;ui.errKey='';render(true);
  setTimeout(function(){finishPay(info);},1600);
}
function doSaveBilling(){
  var b={name:val('b-name'),addr:val('b-addr'),city:val('b-city'),state:val('b-state'),pin:val('b-pin'),gst:val('b-gst').toUpperCase()};
  if(!b.name||!b.addr||!/^\d{6}$/.test(b.pin))return fail('errBilling');
  if(b.gst&&!/^[A-Z0-9]{15}$/.test(b.gst))return fail('errGst');
  user().billing=b;persist();toast(t('billingSaved'));go('hub');
}
function readPhoto(file){
  var rd=new FileReader();
  rd.onload=function(){
    var img=new Image();
    img.onload=function(){
      var max=520,r=Math.min(1,max/Math.max(img.width,img.height));
      var c=document.createElement('canvas');c.width=Math.round(img.width*r);c.height=Math.round(img.height*r);
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      ui.photo=c.toDataURL('image/jpeg',0.72);render(true);
    };
    img.src=rd.result;
  };
  rd.readAsDataURL(file);
}

/* ---------- events ---------- */
root.addEventListener('click',function(e){
  var b=e.target.closest('[data-act]');if(!b)return;
  var a=b.dataset.act,v=b.dataset.v;
  if(a==='open'&&e.target.closest('.heart'))return;
  switch(a){
    case'lang':lang=v;S.lang=v;persist();render(true);break;
    case'authTab':ui.authTab=v;ui.errKey='';render(false);break;
    case'demo':doDemo();break;
    case'nav':if(v==='sell'){ui.editId=null;ui.photo=null;}go(v);break;
    case'locGPS':useMyLocation();break;
    case'locAll':S.loc={state:'',city:''};persist();go('home');break;
    case'locState':ui.locState=v;ui.locQ='';render(false);window.scrollTo(0,0);break;
    case'locBack':ui.locState='';ui.locQ='';render(false);break;
    case'locPick':{var pp=v.split('|');S.loc={state:pp[0],city:pp[1]||''};persist();go('home');break;}
    case'cat':ui.cat=v;ui.brand='all';render(true);break;
    case'brand':ui.brand=v;render(true);break;
    case'catScroll':{var cr=document.getElementById('cats');if(cr)cr.scrollBy({left:parseInt(v,10)*Math.max(160,cr.clientWidth*0.7),behavior:'smooth'});break;}
    case'pickIcon':ui.addCatM.icon=v;ui.addCatM.img=null;render(true);break;
    case'rmLogo':ui.addCatM.img=null;render(true);break;
    case'toggleManage':ui.manage=!ui.manage;render(true);break;
    case'delCatOpen':{
      if(CATS.length<=1){toast(t('cantDeleteLast'));break;}
      ui.delM={kind:'cat',id:v,reason:'',note:''};ui.errKey='';render(true);break;}
    case'delBrandOpen':ui.delM={kind:'brand',cat:ui.cat,id:v,reason:'',note:''};ui.errKey='';render(true);break;
    case'closeDel':ui.delM=null;ui.errKey='';render(true);break;
    case'pickReason':ui.delM.reason=v;ui.delM.note=val('dl-note');ui.errKey='';render(true);break;
    case'confirmDel2':doDelete();break;
    case'addCatOpen':ui.addCatM={icon:'box',img:null};ui.errKey='';render(true);setTimeout(function(){var el=document.getElementById('ac-name');if(el)el.focus();},0);break;
    case'closeAddCat':ui.addCatM=null;ui.errKey='';render(true);break;
    case'addBrandOpen':ui.addBrand={cat:ui.cat};ui.errKey='';render(true);setTimeout(function(){var el=document.getElementById('nb-name');if(el)el.focus();},0);break;
    case'closeAddBrand':ui.addBrand=null;ui.errKey='';render(true);break;
    case'open':ui.openId=v;ui.view='detail';ui.phoneShown=false;render(false);window.scrollTo(0,0);break;
    case'heart':{
      e.stopPropagation();
      var s=mySaved(),i=s.indexOf(v);
      if(i>-1)s.splice(i,1);else s.push(v);
      persist();render(true);break;}
    case'showNo':ui.phoneShown=true;render(false);break;
    case'copyNo':
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(v).then(function(){toast(t('copied'));},function(){toast(t('copyManual'));});}
      else toast(t('copyManual'));
      break;
    case'edit':{
      var ad=adById(v);
      if(ad){ui.editId=v;ui.photo=ad.photo||null;ui.view='sell';ui.errKey='';render(false);window.scrollTo(0,0);}
      break;}
    case'sold':{var x=adById(v);if(x){x.sold=!x.sold;persist();render(true);}break;}
    case'del':
      if(ui.confirmDel===v){S.ads=S.ads.filter(function(x){return x.id!==v;});ui.confirmDel=null;persist();toast(t('deleted'));render(true);}
      else{ui.confirmDel=v;render(true);}
      break;
    case'rmPhoto':ui.photo=null;render(true);break;
    case'choose':case'buyNow':ui.checkout=[v];ui.payFrom=ui.view;ui.errKey='';ui.view='pay';render(false);window.scrollTo(0,0);break;
    case'toggleCart':{
      var uc=user();uc.cart=uc.cart||[];
      if(uc.cart.indexOf(v)<0){uc.cart.push(v);persist();toast(t('addedCart'));render(true);}else go('cart');
      break;}
    case'rmCart':{var u2=user();u2.cart=(u2.cart||[]).filter(function(x){return x!==v;});persist();render(true);break;}
    case'checkout':{
      var u3=user();if(!(u3.cart||[]).length)break;
      ui.checkout=u3.cart.slice();ui.payFrom='cart';ui.errKey='';ui.view='pay';render(false);window.scrollTo(0,0);break;}
    case'payM':ui.payM=v;ui.errKey='';render(true);break;
    case'upiApp':ui.upiApp=ui.upiApp===v?'':v;render(true);break;
    case'wallet':ui.wallet=v;ui.errKey='';render(true);break;
    case'ordTab':ui.ordTab=v;render(false);break;
    case'openInv':ui.invId=v;go('invoice');break;
    case'dlInv':{
      var o=orderById(v);if(!o)break;
      var txt=invoiceText(o);
      try{
        var blob=new Blob([txt],{type:'text/plain'}),a=document.createElement('a');
        a.href=URL.createObjectURL(blob);a.download='invoice-'+o.no+'.txt';
        document.body.appendChild(a);a.click();a.remove();
        setTimeout(function(){URL.revokeObjectURL(a.href);},1000);
        toast(t('invSaved'));
      }catch(e){copyText(txt);}
      break;}
    case'editProfile':{
      var u0=user();
      ui.draft={photo:u0.photo||null,name:u0.name||'',about:u0.about||'',cc:u0.cc||'+91',phone:u0.mobile||S.session,phoneV:!!u0.mobileV,email:u0.email||'',emailV:!!u0.emailV};
      go('editprofile');break;}
    case'info':ui.showInfo=ui.showInfo===v?'':v;render(false);break;
    case'rmEPhoto':ui.draft.photo=null;render(true);break;
    case'clearEmail':ui.draft.email='';ui.draft.emailV=false;render(false);break;
    case'openVerify':{
      var d0=ui.draft;ui.errKey='';
      ui.verify={kind:v,sent:false,otp:'',value:v==='phone'?d0.phone:d0.email,cc:d0.cc};
      render(false);setTimeout(function(){var el=document.getElementById('v-val');if(el)el.focus();},0);break;}
    case'closeVerify':ui.verify=null;ui.errKey='';render(true);break;
    case'changeVal':ui.verify.sent=false;ui.verify.otp='';ui.errKey='';render(true);break;
    case'reqOtp':{
      var vv=ui.verify,val0=document.getElementById('v-val').value.trim();
      if(vv.kind==='phone'){
        var cc0=document.getElementById('v-cc').value;
        var okp=cc0==='+91'?/^\d{10}$/.test(val0):/^\d{6,12}$/.test(val0);
        if(!okp)return fail('errPhoneV');
        vv.cc=cc0;
      }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val0))return fail('errEmail');
      vv.value=val0;vv.sent=true;vv.otp=String(Math.floor(100000+Math.random()*900000));ui.errKey='';
      render(true);setTimeout(function(){var el=document.getElementById('v-otp');if(el)el.focus();},0);break;}
    case'verifyNext':{
      var vn=ui.verify;
      if(!vn.sent)return fail('errNeedReq');
      var entered=(document.getElementById('v-otp').value||'').trim();
      if(entered!==vn.otp)return fail('errOtp');
      var dr=ui.draft;
      if(vn.kind==='phone'){dr.phone=vn.value;dr.cc=vn.cc;dr.phoneV=true;}else{dr.email=vn.value;dr.emailV=true;}
      ui.verify=null;ui.errKey='';render(false);toast(t('verifiedDone'));break;}
    case'saveProfile':{
      if(!canSave())return;
      var dd=ui.draft,uu=user();
      uu.photo=dd.photo;uu.name=dd.name.trim();uu.about=dd.about.trim();uu.cc=dd.cc;uu.mobile=dd.phone;uu.mobileV=dd.phoneV;uu.email=dd.email;uu.emailV=dd.emailV;
      persist();toast(t('profileSaved'));go('profile');break;}
    case'logout':S.session=null;persist();ui.view='auth';ui.authTab='login';render(false);break;
  }
});
root.addEventListener('keydown',function(e){
  if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('card')){
    e.preventDefault();ui.openId=e.target.dataset.v;ui.view='detail';render(false);window.scrollTo(0,0);
  }
});
root.addEventListener('submit',function(e){
  e.preventDefault();
  var id=e.target.id;
  if(id==='f-login')doLogin();else if(id==='f-signup')doSignup();else if(id==='f-ad')doSaveAd();else if(id==='f-pay'&&!ui.paying)doPay();else if(id==='f-billing')doSaveBilling();else if(id==='f-addbrand')saveBrand();else if(id==='f-addcat')saveVehicle();
});
root.addEventListener('input',function(e){
  if(e.target.id==='c-num'){var f1=fmtCard(e.target.value);e.target.value=f1;var nt=document.getElementById('c-net');if(nt)nt.textContent=cardNet(f1);}
  else if(e.target.id==='c-exp'){e.target.value=fmtExp(e.target.value);}
  else if(e.target.id==='c-cvv'){e.target.value=e.target.value.replace(/\D/g,'').slice(0,4);}
  else if(e.target.id==='loc-q'){ui.locQ=e.target.value;var ll=document.getElementById('loc-list');if(ll)ll.innerHTML=locListHTML();}
  else if(e.target.id==='q'){ui.q=e.target.value;var f=document.getElementById('feed');if(f)f.innerHTML=feedHTML();}
  else if(e.target.id==='e-name'&&ui.draft){ui.draft.name=e.target.value;refreshSave();}
  else if(e.target.id==='e-about'&&ui.draft){ui.draft.about=e.target.value;var c=document.getElementById('e-count');if(c)c.textContent=ui.draft.about.length;}
});
root.addEventListener('change',function(e){
  if(e.target.id==='sort'){ui.sort=e.target.value;var f=document.getElementById('feed');if(f)f.innerHTML=feedHTML();}
  if(e.target.id==='ac-logo'&&ui.addCatM&&e.target.files&&e.target.files[0]){var nm=val('ac-name'),bn=val('ac-brand');readImg(e.target.files[0],120,function(d){ui.addCatM.img=d;render(true);});}
  if(e.target.id==='photo'&&e.target.files&&e.target.files[0])readPhoto(e.target.files[0]);
  if(e.target.id==='e-photo'&&ui.draft&&e.target.files&&e.target.files[0])readImg(e.target.files[0],260,function(d){ui.draft.photo=d;render(true);});
  if(e.target.id==='e-cc'&&ui.draft){ui.draft.cc=e.target.value;ui.draft.phoneV=false;render(true);}
  if(e.target.id==='d-cat'){var bs=document.getElementById('d-brand');if(bs)bs.innerHTML=brandOpts(e.target.value,'');syncNewBrand();syncNewCat();}
  if(e.target.id==='d-brand')syncNewBrand();
  if(e.target.id==='d-state'){var cs=document.getElementById('d-city-sel');if(cs)cs.innerHTML=cityOpts(e.target.value,'');syncCity();}
  if(e.target.id==='d-city-sel')syncCity();
  if(e.target.id==='s-hide'){user().hidePhone=e.target.checked;persist();}
});

var _render=render;render=function(k){_render(k);syncNewBrand();syncNewCat();syncCity();};
ui.view=user()?'home':'auth';
render(false);
})();


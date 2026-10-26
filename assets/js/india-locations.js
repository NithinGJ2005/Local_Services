/**
 * Aguntaka Pahachana Kendra - India States, Districts and Taluks Dataset
 * Sourced from official census & administrative data
 */

const INDIA_LOCATION_DATA = {
      "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapura", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgir"],
      "Andhra Pradesh": ["Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya", "Bapatla", "Chittoor", "East Godavari", "Eluru", "Guntur", "Kakinada", "Konaseema", "NTR", "Nandyal", "Palnadu", "Parvathipuram Manyam", "Prakasam", "Srikakulam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
      "Arunachal Pradesh": ["Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"],
      "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
      "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
      "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Khairagarh", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Manendragarh", "Mohla-Manpur", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sarangarh-Bilaigarh", "Sakti", "Sukma", "Surajpur", "Surguja"],
      "Goa": ["North Goa", "South Goa"],
      "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhumi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
      "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
      "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
      "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
      "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
      "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Narmadapuram", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
      "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Chhatrapati Sambhajinagar", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Dharashiv", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
      "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
      "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "Eastern West Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
      "Mizoram": ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saitual", "Siaha", "Serchhip"],
      "Nagaland": ["ChÃ¼moukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Niuland", "Noklak", "Peren", "Phek", "Shamator", "Tseminyu", "Tuensang", "Wokha", "Zunheboto"],
      "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghapur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandamahal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
      "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Firozpur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Shaheed Bhagat Singh Nagar", "Sri Muktsar Sahib", "Tarn Taran"],
      "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
      "Sikkim": ["Gangtok", "Gyalshing", "Pakyong", "Soreng", "Mangan", "Namchi"],
      "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
      "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hanamkonda", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", "Mahbubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"],
      "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
      "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
      "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
      "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
      "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
      "Chandigarh": ["Chandigarh"],
      "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
      "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
      "Jammu and Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
      "Ladakh": ["Kargil", "Leh"],
      "Lakshadweep": ["Lakshadweep"],
      "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
    };

    const TALUK_LOCATION_DATA = {
      // Karnataka (All 31 Districts with Official Taluks)
      "Bagalkot": ["Badami", "Bagalkot", "Bilgi", "Hunagund", "Jamkhandi", "Mudhol", "Ilkal", "Guledgudda", "Rabkavi Banhatti"],
      "Ballari": ["Ballari", "Kurugodu", "Kampli", "Siruguppa", "Sandur"],
      "Belagavi": ["Athani", "Belagavi", "Chikodi", "Gokak", "Hukkeri", "Khanapur", "Kagwad", "Mudalgi", "Nippani", "Raybag", "Saundatti", "Yellamma", "Ramdurg"],
      "Bengaluru Rural": ["Devanahalli", "Doddaballapura", "Hoskote", "Nelamangala"],
      "Bengaluru Urban": ["Anekal", "Bengaluru East", "Bengaluru North", "Bengaluru South", "Yelahanka"],
      "Bidar": ["Aurad", "Basavakalyan", "Bhalki", "Bidar", "Humnabad", "Chitgoppa", "Hulsoor", "Kamalnagar"],
      "Chamarajanagar": ["Chamarajanagar", "Gundlupet", "Kollegal", "Yelandur", "Hanur"],
      "Chikkaballapura": ["Bagepalli", "Chikkaballapura", "Chintamani", "Gauribidanur", "Gudibanda", "Sidlaghatta"],
      "Chikkamagaluru": ["Chikmagalur", "Kadur", "Koppa", "Mudigere", "Narsimharajapura", "Sringeri", "Tarikere", "Ajjampura"],
      "Chitradurga": ["Challakere", "Chitradurga", "Hiriyur", "Holalkere", "Hosadurga", "Molakalmuru"],
      "Dakshina Kannada": ["Bantwal", "Beltangadi", "Mangaluru", "Moodabidri", "Puttur", "Sulya", "Kadaba", "Ullal"],
      "Davanagere": ["Channagiri", "Davanagere", "Harihar", "Honnali", "Jagalur", "Nyamathi"],
      "Dharwad": ["Alnavar", "Annigeri", "Dharwad", "Hubballi Rural", "Hubballi Urban", "Kalghatgi", "Kundgol", "Navalgund"],
      "Gadag": ["Gadag", "Gajendragad", "Laxmeshwar", "Mundargi", "Nargund", "Ron", "Shirahatti"],
      "Hassan": ["Alur", "Arkalgud", "Arsikere", "Belur", "Channarayapatna", "Hassan", "Holenarsipur", "Sakleshpur"],
      "Haveri": ["Byadgi", "Hangal", "Haveri", "Hirekerur", "Ranibennur", "Rattihalli", "Savanur", "Shiggaon"],
      "Kalaburagi": ["Afzalpur", "Aland", "Chincholi", "Chitapur", "Kalaburagi", "Jevargi", "Kalgi", "Kamalapur", "Sedam", "Shahabad", "Yedrami"],
      "Kodagu": ["Kushalnagar", "Madikeri", "Ponnampet", "Somwarpet", "Virajpet"],
      "Kolar": ["Bangarapet", "KGF", "Kolar", "Malur", "Mulbagal", "Srinivaspur"],
      "Koppal": ["Gangavathi", "Kanakagiri", "Karatagi", "Koppal", "Kuknoor", "Kushtagi", "Yelburga"],
      "Mandya": ["Bookanakere", "KR Pet", "Maddur", "Malavalli", "Mandya", "Nagamangala", "Pandavapura", "Srirangapatna"],
      "Mysuru": ["Heggadadevankote", "Hunsur", "KR Nagar", "Mysuru", "Nanjangud", "Piriyapatna", "Saligrama", "Saragur", "T Narsipur"],
      "Raichur": ["Devadurga", "Lingasugur", "Manvi", "Maski", "Raichur", "Sindhanur", "Sirwar"],
      "Ramanagara": ["Channapatna", "Harohalli", "Kanakapura", "Magadi", "Ramanagara"],
      "Shivamogga": ["Bhadravathi", "Hosanagara", "Sagar", "Shikaripura", "Shivamogga", "Soraba", "Thirthahalli"],
      "Tumakuru": ["Chiknayakanhalli", "Gubbi", "Koratagere", "Kunigal", "Madhugiri", "Pavagada", "Sira", "Tiptur", "Tumakuru", "Turuvekere"],
      "Udupi": ["Brahmavar", "Byndoor", "Hebri", "Kapu", "Karkala", "Kundapura", "Udupi"],
      "Uttara Kannada": ["Ankola", "Bhatkal", "Dandeli", "Haliyal", "Honnavar", "Joida", "Karwar", "Kumta", "Mundgod", "Siddapur", "Sirsi", "Yellapur"],
      "Vijayanagara": ["Hagaribommanahalli", "Harapanahalli", "Hoovina Hadagali", "Hospet", "Kotturu", "Kudligi"],
      "Vijayapura": ["Babaleshwar", "Basavana Bagewadi", "Bijapur", "Chadchan", "Devar Hippargi", "Indi", "Muddebihal", "Nidagundi", "Sindgi", "Talikoti", "Tikota"],
      "Yadgir": ["Gurmatkal", "Hunasagi", "Shahapur", "Shorapur", "Vadagera", "Yadgir"],

      // Andhra Pradesh
      "Alluri Sitharama Raju": ["Araku Valley", "Paderu", "Rampachodavaram", "Chintoor", "Chintapalle", "Ananthagiri"],
      "Anakapalli": ["Anakapalli", "Chodavaram", "Yelamanchili", "Kasimkota", "Pendurthi", "Atchutapuram"],
      "Ananthapuramu": ["Anantapur", "Dharmavaram", "Guntakal", "Tadipatri", "Rayadurg", "Kalyandurg", "Uravakonda"],
      "Annamayya": ["Rajampet", "Madanapalle", "Rayachoti", "Kodur", "Railway Kodur"],
      "Bapatla": ["Bapatla", "Chirala", "Repalle", "Addanki", "Parchur"],
      "Chittoor": ["Chittoor", "Nagari", "Palamaner", "Punganur", "GD Nellore", "Kuppam"],
      "East Godavari": ["Rajamahendravaram", "Kovvur", "Nidadavole", "Anaparthi"],
      "Eluru": ["Eluru", "Jangareddigudem", "Nuzvid", "Chintalapudi"],
      "Guntur": ["Guntur", "Tenali", "Mangalagiri", "Tadikonda", "Ponnur"],
      "Kakinada": ["Kakinada", "Pithapuram", "Samalkot", "Peddapuram", "Tuni"],
      "Konaseema": ["Amalapuram", "Razole", "Ramachandrapuram", "Kothapeta"],
      "NTR": ["Vijayawada North", "Vijayawada South", "Vijayawada Central", "Tiruvuru", "Nandigama", "Jaggaiahpet"],
      "Nandyal": ["Nandyal", "Allagadda", "Banaganapalle", "Dhone", "Nandikotkur", "Atmakur"],
      "Palnadu": ["Narasaraopet", "Sattenapalle", "Gurazala", "Vinukonda", "Macherla"],
      "Parvathipuram Manyam": ["Parvathipuram", "Salur", "Palakonda", "Kurupam"],
      "Prakasam": ["Ongole", "Kandukur", "Markapur", "Giddalur", "Kanigiri"],
      "Srikakulam": ["Srikakulam", "Palasa", "Tekkali", "Amadalavalasa", "Narasannapeta"],
      "Sri Potti Sriramulu Nellore": ["Nellore", "Kavali", "Gudur", "Atmakur", "Kovur"],
      "Sri Sathya Sai": ["Puttaparthi", "Kadiri", "Hindupur", "Penukonda", "Dharmavaram"],
      "Tirupati": ["Tirupati", "Srikalahasti", "Gudur", "Venkatagiri", "Sulurpet"],
      "Visakhapatnam": ["Visakhapatnam Urban", "Bheemunipatnam", "Gajuwaka", "Anandapuram", "Padmanabham"],
      "Vizianagaram": ["Vizianagaram", "Bobbili", "Cheepurupalli", "Gajapathinagaram", "S Kota"],
      "West Godavari": ["Bhimavaram", "Narasapuram", "Tadepalligudem", "Tanuku"],
      "YSR Kadapa": ["Kadapa", "Badvel", "Jammalamadugu", "Proddatur", "Pulivendula", "Rayachoti"],

      // Telangana
      "Adilabad": ["Adilabad", "Utnoor", "Boath", "Bela", "Jainath"],
      "Bhadradri Kothagudem": ["Kothagudem", "Bhadrachalam", "Palwancha", "Yellandu", "Manuguru"],
      "Hanamkonda": ["Hanamkonda", "Kazipet", "Parkal", "Kamalapur", "Bheemadevarapalle"],
      "Hyderabad": ["Amberpet", "Asifnagar", "Bahadurpura", "Charminar", "Khairatabad", "Musheerabad", "Secunderabad", "Ameerpet", "Himayatnagar", "Nampally", "Shaikpet"],
      "Jagtial": ["Jagtial", "Korutla", "Metpally", "Dharmapuri"],
      "Jangaon": ["Jangaon", "Station Ghanpur", "Palakurthi", "Bachannapet"],
      "Jayashankar Bhupalpally": ["Bhupalpally", "Kataram", "Mahadevpur", "Tekumatla"],
      "Jogulamba Gadwal": ["Gadwal", "Alampur", "Ieeja", "Dharur"],
      "Kamareddy": ["Kamareddy", "Banswada", "Yellareddy", "Domakonda"],
      "Karimnagar": ["Karimnagar", "Huzurabad", "Choppadandi", "Manakondur"],
      "Khammam": ["Khammam Urban", "Khammam Rural", "Kalluru", "Wyra", "Sathupally"],
      "Kumuram Bheem Asifabad": ["Asifabad", "Kaghaznagar", "Sirpur", "Rebbena"],
      "Mahabubabad": ["Mahabubabad", "Thorrur", "Maripeda", "Kuravi"],
      "Mahbubnagar": ["Mahbubnagar", "Jadcherla", "Devarkadra", "Badepalle"],
      "Mancherial": ["Mancherial", "Bellampalle", "Chennur", "Mandamarri"],
      "Medak": ["Medak", "Ramayampet", "Narsapur", "Tupran"],
      "Medchal-Malkajgiri": ["Malkajgiri", "Quthbullapur", "Kukatpally", "Uppal", "Medchal", "Alwal", "Balanagar"],
      "Mulugu": ["Mulugu", "Eturnagaram", "Venkatapur", "Tadvai"],
      "Nagarkurnool": ["Nagarkurnool", "Achampet", "Kollapur", "Kalwakurthy"],
      "Nalgonda": ["Nalgonda", "Miryalaguda", "Devarakonda", "Nakrekal"],
      "Narayanpet": ["Narayanpet", "Kosgi", "Damaragidda", "Makthal"],
      "Nirmal": ["Nirmal", "Bhainsa", "Khanapur", "Mudhole"],
      "Nizamabad": ["Nizamabad Urban", "Nizamabad Rural", "Armoor", "Bodhan", "Balkonda"],
      "Peddapalli": ["Peddapalli", "Ramagundam", "Manthani", "Sultanabad"],
      "Rajanna Sircilla": ["Sircilla", "Vemulawada", "Chandurthi", "Yellreddypet"],
      "Ranga Reddy": ["Chevella", "Ibrahimpatnam", "Rajendranagar", "Serilingampally", "Hayathnagar", "Maheshwaram", "Saroornagar"],
      "Sangareddy": ["Sangareddy", "Zaheerabad", "Patancheru", "Narayankhed", "Andole"],
      "Siddipet": ["Siddipet", "Gajwel", "Husnabad", "Dubbak", "Cherial"],
      "Suryapet": ["Suryapet", "Kodad", "Huzurnagar", "Tungaturthi"],
      "Vikarabad": ["Vikarabad", "Tandur", "Pargi", "Kodangal"],
      "Wanaparthy": ["Wanaparthy", "Kothakota", "Atmakur", "Pangal"],
      "Warangal": ["Warangal", "Narsampet", "Wardhannapet", "Chennaraopet"],
      "Yadadri Bhuvanagiri": ["Bhongir", "Choutuppal", "Alair", "Mothkur"],

      // Tamil Nadu
      "Ariyalur": ["Ariyalur", "Sendurai", "Udayarpalayam", "Andimadam"],
      "Chengalpattu": ["Chengalpattu", "Tambaram", "Pallavaram", "Vandalur", "Maduranthakam", "Cheyyur", "Thiruporur"],
      "Chennai": ["Alandur", "Ambattur", "Aminjikarai", "Ayanavaram", "Egmore", "Guindy", "Madhavaram", "Mambalam", "Mylapore", "Perambur", "Purasawalkam", "Sholinganallur", "Thiruvanmiyur", "Tondiarpet", "Velachery"],
      "Coimbatore": ["Coimbatore North", "Coimbatore South", "Pollachi", "Mettupalayam", "Sulur", "Valparai", "Annur", "Perur", "Kinathukadavu"],
      "Cuddalore": ["Cuddalore", "Chidambaram", "Panruti", "Vriddhachalam", "Kurinjipadi", "Tittagudi", "Bhuvanagiri", "Veppur"],
      "Dharmapuri": ["Dharmapuri", "Harur", "Palacode", "Pennagaram", "Pappireddipatti"],
      "Dindigul": ["Dindigul East", "Dindigul West", "Palani", "Kodaikanal", "Nilakottai", "Oddanchatram", "Natham", "Vedasandur"],
      "Erode": ["Erode", "Gobichettipalayam", "Bhavani", "Perundurai", "Sathyamangalam", "Modakurichi", "Thalavadi"],
      "Kallakurichi": ["Kallakurichi", "Sankarapuram", "Tirukoilur", "Ulundurpet", "Chinnasalem"],
      "Kanchipuram": ["Kanchipuram", "Sriperumbudur", "Uthiramerur", "Walajabad"],
      "Kanyakumari": ["Agastheeswaram", "Kalkulam", "Vilavancode", "Thovalai"],
      "Karur": ["Karur", "Kulithalai", "Aravakurichi", "Manmangalam", "Krishnarayapuram"],
      "Krishnagiri": ["Krishnagiri", "Hosur", "Denkanikottai", "Pochampalli", "Uthangarai", "Bargur"],
      "Madurai": ["Madurai North", "Madurai South", "Melur", "Thirumangalam", "Usilampatti", "Vadipatti", "Thiruparankundram", "Peraiyur"],
      "Mayiladuthurai": ["Mayiladuthurai", "Sirkazhi", "Tharangambadi", "Kuthalam"],
      "Nagapattinam": ["Nagapattinam", "Kilvelur", "Vedaranyam", "Thirukkuvalai"],
      "Namakkal": ["Namakkal", "Rasipuram", "Tiruchengode", "Paramathi Velur", "Kolli Hills"],
      "Nilgiris": ["Udhagamandalam", "Coonoor", "Gudalur", "Kotagiri", "Kundah", "Pandalur"],
      "Perambalur": ["Perambalur", "Kunnam", "Veppanthattai", "Alathur"],
      "Pudukkottai": ["Pudukkottai", "Aranthangi", "Avudaiyarkoil", "Gandarvakkottai", "Illuppur", "Karambakudi", "Kulathur", "Thirumayam"],
      "Ramanathapuram": ["Ramanathapuram", "Paramakudi", "Rameswaram", "Tiruvadanai", "Mudukulathur", "Kadaladi", "Kamuthi"],
      "Ranipet": ["Ranipet", "Arakkonam", "Arcot", "Walajah", "Sholinghur"],
      "Salem": ["Salem", "Attur", "Mettur", "Omalur", "Sankari", "Yercaud", "Edappadi", "Gangavalli"],
      "Sivaganga": ["Sivaganga", "Karaikudi", "Devakottai", "Manamadurai", "Ilayangudi", "Tiruppattur"],
      "Tenkasi": ["Tenkasi", "Ambasamudram", "Kadayanallur", "Sankarankovil", "Shenkottai", "Sivagiri"],
      "Thanjavur": ["Thanjavur", "Kumbakonam", "Pattukkottai", "Orathanadu", "Papanasam", "Thiruvaiyaru", "Peravurani"],
      "Theni": ["Theni", "Bodinayakanur", "Periyakulam", "Uthamapalayam", "Andipatti"],
      "Thoothukudi": ["Thoothukudi", "Tiruchendur", "Kovilpatti", "Ettayapuram", "Sathankulam", "Srivaikuntam", "Vilathikulam"],
      "Tiruchirappalli": ["Tiruchirappalli East", "Tiruchirappalli West", "Lalgudi", "Manapparai", "Musiri", "Srirangam", "Thottiyam", "Thuraiyur"],
      "Tirunelveli": ["Tirunelveli", "Palayamkottai", "Ambasamudram", "Cheranmahadevi", "Nanguneri", "Radhapuram"],
      "Tirupathur": ["Tirupathur", "Vaniyambadi", "Ambur", "Natrampalli"],
      "Tiruppur": ["Tiruppur North", "Tiruppur South", "Avinashi", "Dharapuram", "Kangeyam", "Udumalaipettai", "Palladam"],
      "Tiruvallur": ["Tiruvallur", "Avadi", "Ponneri", "Poonamallee", "Tiruttani", "Gummidipoondi"],
      "Tiruvannamalai": ["Tiruvannamalai", "Arani", "Cheyyar", "Polur", "Chengam", "Vandavasi"],
      "Tiruvarur": ["Tiruvarur", "Mannargudi", "Nannilam", "Thiruthuraipoondi", "Valangaiman"],
      "Vellore": ["Vellore", "Anaicut", "Gudiyattam", "Katpadi", "Pernambut"],
      "Viluppuram": ["Viluppuram", "Tindivanam", "Gingee", "Vanur", "Vikravandi"],
      "Virudhunagar": ["Virudhunagar", "Sivakasi", "Rajapalayam", "Aruppukkottai", "Sattur", "Srivilliputhur"],

      // Kerala
      "Alappuzha": ["Ambalappuzha", "Cherthala", "Kuttanad", "Karthikappally", "Mavelikkara", "Chengannur"],
      "Ernakulam": ["Aluva", "Kanayannur", "Kochi", "Kothamangalam", "Kunnathunad", "Muvattupuzha", "Paravur"],
      "Idukki": ["Devikulam", "Peermade", "Thodupuzha", "Udumbanchola", "Idukki"],
      "Kannur": ["Kannur", "Thalassery", "Taliparamba", "Iritty", "Payyanur"],
      "Kasaragod": ["Kasaragod", "Hosdurg", "Manjeshwaram", "Vellarikundu"],
      "Kollam": ["Kollam", "Karunagappally", "Kunnathur", "Kottarakkara", "Pathanapuram", "Punalur"],
      "Kottayam": ["Kottayam", "Changanassery", "Kanjirappally", "Meenachil", "Vaikom"],
      "Kozhikode": ["Kozhikode", "Koyilandy", "Thamarassery", "Vadakara"],
      "Malappuram": ["Ernad", "Nilambur", "Perinthalmanna", "Tirur", "Tirurangadi", "Ponnani", "Kondotty"],
      "Palakkad": ["Palakkad", "Alathur", "Chittur", "Ottapalam", "Pattambi", "Mannarkkad"],
      "Pathanamthitta": ["Kozhencherry", "Adoor", "Ranni", "Thiruvalla", "Mallappally", "Konni"],
      "Thiruvananthapuram": ["Chirayinkeezhu", "Kattakada", "Nedumangad", "Neyyattinkara", "Thiruvananthapuram", "Varkala"],
      "Thrissur": ["Thrissur", "Chalakudy", "Chavakkad", "Kodungallur", "Mukundapuram", "Thalapilly"],
      "Wayanad": ["Mananthavady", "Sulthan Bathery", "Vythiri"],

      // Maharashtra
      "Ahmednagar": ["Ahmednagar", "Sangamner", "Kopargaon", "Rahata", "Shrigonda", "Karjat", "Parner", "Akole", "Pathardi", "Newasa"],
      "Akola": ["Akola", "Akot", "Balapur", "Murtizapur", "Telhara", "Patur", "Barshitakli"],
      "Amravati": ["Amravati", "Achalpur", "Chandur Railway", "Dhamangaon Railway", "Morshi", "Warud", "Daryapur", "Anjangaon Surji"],
      "Chhatrapati Sambhajinagar": ["Sambhajinagar", "Paithan", "Sillod", "Vaijapur", "Kannad", "Khuldabad", "Phulambri", "Gangapur"],
      "Beed": ["Beed", "Ambejogai", "Georai", "Parli", "Majalgaon", "Kaij", "Patoda", "Ashti"],
      "Bhandara": ["Bhandara", "Tumsar", "Mohadi", "Sakoli", "Lakhani", "Pauni", "Lakhandur"],
      "Buldhana": ["Buldhana", "Chikhli", "Khamgaon", "Malkapur", "Mehkar", "Shegaon", "Nandura", "Jalgaon Jamod"],
      "Chandrapur": ["Chandrapur", "Warora", "Bhadravati", "Ballarpur", "Rajura", "Mul", "Nagbhir", "Brahmapuri"],
      "Dhule": ["Dhule", "Sakri", "Shirpur", "Shindkheda"],
      "Gadchiroli": ["Gadchiroli", "Aheri", "Armori", "Chamorshi", "Dhanora", "Kurkheda"],
      "Gondia": ["Gondia", "Tirora", "Goregaon", "Arjuni Morgaon", "Deori", "Salekasa"],
      "Hingoli": ["Hingoli", "Basmath", "Kalamnuri", "Aundha Nagnath", "Sengaon"],
      "Jalgaon": ["Jalgaon", "Bhusawal", "Chalisgaon", "Jamner", "Amalner", "Chopda", "Yawal", "Raver", "Pachora"],
      "Jalna": ["Jalna", "Ambad", "Bhokardan", "Partur", "Badnapur", "Ghansawangi", "Jafrabad"],
      "Kolhapur": ["Karveer", "Ichalkaranji", "Kagal", "Radhanagari", "Shahuwadi", "Panhala", "Gadhinglaj", "Chandgad", "Ajara", "Shirol"],
      "Latur": ["Latur", "Udgir", "Ahmedpur", "Nilanga", "Ausa", "Chakur", "Shirur Anantpal"],
      "Mumbai City": ["Colaba", "Fort", "Girgaon", "Malabar Hill", "Tardeo", "Dadar", "Byculla"],
      "Mumbai Suburban": ["Andheri", "Bandra", "Borivali", "Kurla", "Malad", "Ghatkopar"],
      "Nagpur": ["Nagpur Urban", "Nagpur Rural", "Kamptee", "Hingna", "Katol", "Narkhed", "Savner", "Kalameshwar", "Ramtek", "Mouda", "Umred"],
      "Nanded": ["Nanded", "Kandhar", "Degloor", "Kinwat", "Hadgaon", "Mukhed", "Bhokar", "Mudkhed"],
      "Nandurbar": ["Nandurbar", "Shahada", "Navapur", "Taloda", "Akkalkuwa", "Akrani"],
      "Nashik": ["Nashik", "Malegaon", "Sinnar", "Igatpuri", "Niphad", "Yeola", "Nandgaon", "Kalwan", "Dindori", "Chandwad", "Baglan"],
      "Dharashiv": ["Dharashiv", "Tuljapur", "Omerga", "Paranda", "Kalamb", "Bhoom", "Lohara", "Washi"],
      "Palghar": ["Palghar", "Vasai", "Dahanu", "Wada", "Jawhar", "Vikramgad", "Talasari", "Mokhada"],
      "Parbhani": ["Parbhani", "Gangakhed", "Jintur", "Pathri", "Sailu", "Manwath", "Purna"],
      "Pune": ["Haveli", "Khed", "Baramati", "Junnar", "Shirur", "Ambegaon", "Maval", "Mulshi", "Purandar", "Bhor", "Indapur", "Daund", "Velhe"],
      "Raigad": ["Alibag", "Panvel", "Karjat", "Khalapur", "Pen", "Roha", "Mangaon", "Mahad", "Shrivardhan", "Uran"],
      "Ratnagiri": ["Ratnagiri", "Chiplun", "Khed", "Dapoli", "Sangameshwar", "Rajapur", "Guhagar", "Mandangad", "Lanja"],
      "Sangli": ["Miraj", "Walwa", "Vita", "Tasgaon", "Jat", "Shirala", "Palus", "Atpadi", "Kavathe Mahankal"],
      "Satara": ["Satara", "Karad", "Wai", "Mahabaleshwar", "Phaltan", "Koregaon", "Khatav", "Patan", "Jaoli"],
      "Sindhudurg": ["Kankavli", "Sawantwadi", "Malvan", "Kudal", "Vengurla", "Devgad", "Vaibhavwadi", "Dodamarg"],
      "Solapur": ["Solapur North", "Solapur South", "Barshi", "Pandharpur", "Sangole", "Malshiras", "Akkalkot", "Karmala", "Mohol", "Madha"],
      "Thane": ["Thane", "Kalyan", "Murbad", "Bhiwandi", "Shahapur", "Ulhasnagar", "Navi Mumbai"],
      "Wardha": ["Wardha", "Hinganghat", "Arvi", "Deoli", "Seloo", "Karanja", "Ashti"],
      "Washim": ["Washim", "Karanja", "Risod", "Malegaon", "Mangrulpir", "Manora"],
      "Yavatmal": ["Yavatmal", "Pusad", "Umarkhed", "Wani", "Digras", "Darwha", "Kelapur", "Arni"],

      // Gujarat
      "Ahmedabad": ["Ahmedabad Urban", "Daskroi", "Sanand", "Bavla", "Dholka", "Viramgam", "Mandal", "Detroj", "Dhandhuka"],
      "Amreli": ["Amreli", "Babra", "Dhari", "Jafrabad", "Khambha", "Lathi", "Lilia", "Rajula", "Savarkundla"],
      "Anand": ["Anand", "Anklav", "Borsad", "Khambhat", "Petlad", "Sojitra", "Umreth", "Tarapur"],
      "Aravalli": ["Modasa", "Bhiloda", "Bayad", "Dhansura", "Malpur", "Meghraj"],
      "Banaskantha": ["Palanpur", "Deesa", "Tharad", "Dhanera", "Danta", "Kankrej", "Vadgam", "Vav", "Bhabhar", "Lakhani"],
      "Bharuch": ["Bharuch", "Ankleshwar", "Jambusar", "Amod", "Hansot", "Vagra", "Jhagadia", "Netrang"],
      "Bhavnagar": ["Bhavnagar", "Palitana", "Mahuva", "Talaja", "Shihor", "Ghogha", "Gariadhar", "Umrala"],
      "Botad": ["Botad", "Gadhada", "Barwala", "Ranpur"],
      "Chhota Udaipur": ["Chhota Udaipur", "Bodeli", "Jetpur Pavi", "Kavant", "Nasvadi", "Sankheda"],
      "Dahod": ["Dahod", "Devgadh Baria", "Garbada", "Jhalod", "Limkheda", "Fatepura", "Singvad"],
      "Dang": ["Ahwa", "Subir", "Waghai"],
      "Devbhumi Dwarka": ["Khambhalia", "Dwarka", "Kalyanpur", "Bhanvad"],
      "Gandhinagar": ["Gandhinagar", "Kalol", "Dehgam", "Mansa"],
      "Gir Somnath": ["Veraval", "Somnath", "Una", "Kodinar", "Talala", "Sutrapada", "Gir Gadhada"],
      "Jamnagar": ["Jamnagar", "Lalpur", "Jamjodhpur", "Dhrol", "Jodiya", "Kalavad"],
      "Junagadh": ["Junagadh Urban", "Junagadh Rural", "Keshod", "Manavadar", "Mangrol", "Mendarda", "Vanthali", "Visavadar"],
      "Kheda": ["Nadiad", "Kheda", "Kapadvanj", "Balasinor", "Mahudha", "Matar", "Mehmedabad", "Thasra"],
      "Kutch": ["Bhuj", "Anjar", "Gandhidham", "Mandvi", "Mundra", "Nakhatrana", "Abdasa", "Lakhpat", "Bhachau", "Rapar"],
      "Mahisagar": ["Lunawada", "Balasinor", "Kadana", "Khanpur", "Santrampur", "Virpur"],
      "Mehsana": ["Mehsana", "Kadi", "Unjha", "Visnagar", "Vadnagar", "Kheralu", "Becharaji", "Vijapur", "Satlasana"],
      "Morbi": ["Morbi", "Wankaner", "Halvad", "Tankara", "Maliya"],
      "Narmada": ["Rajpipla", "Dediapada", "Sagbara", "Tilakwada", "Garudeshwar"],
      "Navsari": ["Navsari", "Jalalpore", "Gandevi", "Chikhli", "Vansda", "Khergam"],
      "Panchmahal": ["Godhra", "Halol", "Kalol", "Ghoghamba", "Jambughoda", "Morwa Hadaf", "Shehra"],
      "Patan": ["Patan", "Radhanpur", "Chanasma", "Harij", "Sidhpur", "Sami", "Shankheshwar", "Santalpur"],
      "Porbandar": ["Porbandar", "Kutiyana", "Ranavav"],
      "Rajkot": ["Rajkot", "Gondal", "Jetpur", "Jasdan", "Dhoraji", "Upleta", "Morvi", "Kotda Sangani", "Lodhika", "Paddhari"],
      "Sabarkantha": ["Himatnagar", "Idar", "Khedbrahma", "Prantij", "Talod", "Vadali", "Vijaynagar"],
      "Surat": ["Surat City", "Chorasi", "Olpad", "Kamrej", "Bardoli", "Mandvi", "Palsana", "Mahuva", "Umarpada"],
      "Surendranagar": ["Wadhwan", "Chotila", "Dhrangadhra", "Halvad", "Limbdi", "Muli", "Sayla", "Thangadh"],
      "Tapi": ["Vyara", "Songadh", "Valod", "Uchchhal", "Nizar", "Kukarmunda"],
      "Vadodara": ["Vadodara", "Dabhoi", "Karjan", "Padra", "Savli", "Vaghodia", "Sinor"],
      "Valsad": ["Valsad", "Vapi", "Pardi", "Umbergaon", "Dharampur", "Kaprada"],

      // Rajasthan
      "Ajmer": ["Ajmer", "Beawar", "Kekri", "Kishangarh", "Nasirabad", "Pushkar", "Sarwar"],
      "Alwar": ["Alwar", "Behror", "Bhiwadi", "Bansur", "Laxmangarh", "Rajgarh", "Ramgarh", "Tijara"],
      "Banswara": ["Banswara", "Bagidora", "Garhi", "Ghatol", "Kushalgarh"],
      "Baran": ["Baran", "Antah", "Atru", "Chhabra", "Chhipabarod", "Kishanganj"],
      "Barmer": ["Barmer", "Balotra", "Chohtan", "Gudamalani", "Siwana", "Baytoo"],
      "Bharatpur": ["Bharatpur", "Bayana", "Deeg", "Kaman", "Nadbai", "Nagar", "Weir"],
      "Bhilwara": ["Bhilwara", "Asind", "Mandal", "Mandalgarh", "Shahpura", "Jahazpur"],
      "Bikaner": ["Bikaner", "Dungargarh", "Khajuwala", "Lunkaransar", "Nokha"],
      "Bundi": ["Bundi", "Hindoli", "Indergarh", "Keshoraipatan", "Nainwa"],
      "Chittorgarh": ["Chittorgarh", "Begun", "Kapasan", "Nimbahera", "Rawatbhata"],
      "Churu": ["Churu", "Bidasar", "Rajgarh", "Ratangarh", "Sardarshahar", "Sujangarh", "Taranagar"],
      "Dausa": ["Dausa", "Bandikui", "Lalsot", "Mahwa", "Sikrai"],
      "Dholpur": ["Dholpur", "Bari", "Baseri", "Rajakhera"],
      "Dungarpur": ["Dungarpur", "Aspur", "Bichhiwara", "Sagwara", "Simalwara"],
      "Hanumangarh": ["Hanumangarh", "Bhadra", "Nohar", "Pilibanga", "Rawatsar"],
      "Jaipur": ["Jaipur", "Amber", "Chaksu", "Chomu", "Jamwa Ramgarh", "Kotputli", "Phulera", "Shahpura", "Sanganer"],
      "Jaisalmer": ["Jaisalmer", "Pokhran", "Fatehgarh"],
      "Jalore": ["Jalore", "Ahore", "Bhinmal", "Raniwara", "Sanchore"],
      "Jhalawar": ["Jhalawar", "Aklera", "Bhawani Mandi", "Dag", "Jhalrapatan", "Khanpur"],
      "Jhunjhunu": ["Jhunjhunu", "Buhana", "Chirawa", "Khetri", "Nawalgarh", "Udaipurwati"],
      "Jodhpur": ["Jodhpur", "Bilara", "Osian", "Phalodi", "Pipar City", "Shergarh"],
      "Karauli": ["Karauli", "Hindaun", "Mandrail", "Sapotra", "Todabhim"],
      "Kota": ["Kota", "Sangod", "Digod", "Ramganj Mandi", "Ladpura"],
      "Nagaur": ["Nagaur", "Didwana", "Degana", "Ladnun", "Merta", "Makrana", "Parbatsar"],
      "Pali": ["Pali", "Bali", "Desuri", "Jaitaran", "Marwar Junction", "Rohat", "Sojat"],
      "Pratapgarh": ["Pratapgarh", "Chhoti Sadri", "Dhariawad", "Peepalkhoont"],
      "Rajsamand": ["Rajsamand", "Amet", "Bhim", "Deogarh", "Kumbhalgarh", "Nathdwara"],
      "Sawai Madhopur": ["Sawai Madhopur", "Bamanwas", "Bonli", "Gangapur City", "Khandar"],
      "Sikar": ["Sikar", "Danta Ramgarh", "Fatehpur", "Laxmangarh", "Neem Ka Thana", "Sri Madhopur"],
      "Sirohi": ["Sirohi", "Abu Road", "Sheoganj", "Pindwara", "Reodar"],
      "Sri Ganganagar": ["Sri Ganganagar", "Anupgarh", "Suratgarh", "Raisinghnagar", "Padampur"],
      "Tonk": ["Tonk", "Deoli", "Malpura", "Niwai", "Todaraisingh"],
      "Udaipur": ["Udaipur", "Badgaon", "Girwa", "Jhadol", "Kherwara", "Mavli", "Salumbar", "Sarada"],

      // Uttar Pradesh
      "Agra": ["Agra", "Etmadpur", "Fatehabad", "Kheragarh", "Kirao", "Bah"],
      "Aligarh": ["Aligarh", "Atrauli", "Gabhana", "Iglas", "Khair"],
      "Ambedkar Nagar": ["Akbarpur", "Tanda", "Jalalpur", "Alapur", "Bhiti"],
      "Amethi": ["Gauriganj", "Amethi", "Musafirkhana", "Tiloi"],
      "Amroha": ["Amroha", "Dhanaura", "Hasanpur"],
      "Auraiya": ["Auraiya", "Bidhuna", "Ajitmal"],
      "Ayodhya": ["Ayodhya", "Bikapur", "Milkipur", "Rudauli", "Sohawal"],
      "Azamgarh": ["Azamgarh", "Burhanpur", "Lalganj", "Phoolpur", "Sagri"],
      "Baghpat": ["Baghpat", "Baraut", "Khekada"],
      "Bahraich": ["Bahraich", "Kaiserganj", "Mahasi", "Nanpara", "Payagpur"],
      "Ballia": ["Ballia", "Bansdih", "Bairia", "Belthara Road", "Rasra"],
      "Balrampur": ["Balrampur", "Tulsipur", "Utraula"],
      "Banda": ["Banda", "Atarra", "Baberu", "Naini"],
      "Barabanki": ["Barabanki", "Fatehpur", "Haidergarh", "Nawabganj", "Ramsanehi Ghat"],
      "Bareilly": ["Bareilly", "Aonla", "Baheri", "Faridpur", "Mirganj"],
      "Basti": ["Basti", "Harraiya", "Bhanpur", "Rudhauli"],
      "Bhadohi": ["Bhadohi", "Gyanpur", "Aurai"],
      "Bijnor": ["Bijnor", "Chandpur", "Dhampur", "Nagini", "Najibabad"],
      "Budaun": ["Budaun", "Bisauli", "Data Ganj", "Sahaswan"],
      "Bulandshahr": ["Bulandshahr", "Anupshahr", "Debai", "Khurja", "Sikandrabad"],
      "Chandauli": ["Chandauli", "Chakia", "Sakaldiha"],
      "Chitrakoot": ["Karwi", "Mau"],
      "Deoria": ["Deoria", "Bhatpar Rani", "Salempur", "Rudrapur"],
      "Etah": ["Etah", "Aliganj", "Jalesar"],
      "Etawah": ["Etawah", "Bhartana", "Jaswantnagar", "Saifai"],
      "Farrukhabad": ["Farrukhabad", "Kaimganj", "Amritpur"],
      "Fatehpur": ["Fatehpur", "Bindki", "Khaga"],
      "Firozabad": ["Firozabad", "Shikohabad", "Tundla", "Jasrana"],
      "Gautam Buddha Nagar": ["Noida", "Greater Noida", "Dadri", "Jewar"],
      "Ghaziabad": ["Ghaziabad", "Loni", "Modi Nagar"],
      "Ghazipur": ["Ghazipur", "Zamania", "Saidpur", "Mohammadabad"],
      "Gonda": ["Gonda", "Colonelganj", "Mankapur", "Tarbganj"],
      "Gorakhpur": ["Gorakhpur", "Bansgaon", "Campierganj", "Khajani", "Sahjanwa"],
      "Hamirpur": ["Hamirpur", "Maudaha", "Rath", "Sarila"],
      "Hapur": ["Hapur", "Garhmukteshwar", "Dhaulana"],
      "Hardoi": ["Hardoi", "Bilgram", "Gopamau", "Shahabad", "Sandila"],
      "Hathras": ["Hathras", "Sikandra Rao", "Sadabad", "Sasni"],
      "Jalaun": ["Orai", "Jalaun", "Kalpi", "Konch"],
      "Jaunpur": ["Jaunpur", "Badlapur", "Machhlishahr", "Shahganj"],
      "Jhansi": ["Jhansi", "Garautha", "Mauranipur", "Moth", "Tehroli"],
      "Kannauj": ["Kannauj", "Chhibramau", "Tirwa"],
      "Kanpur Dehat": ["Akbarpur", "Bhognipur", "Derapur", "Rania"],
      "Kanpur Nagar": ["Kanpur Sadar", "Ghatampur", "Bilhaur"],
      "Kasganj": ["Kasganj", "Ganjdundwara", "Patiyali"],
      "Kaushambi": ["Manjhanpur", "Chail", "Sirathu"],
      "Kheri": ["Lakhimpur", "Gola Gokarannath", "Mohammdi", "Nighasan"],
      "Kushinagar": ["Padrauna", "Hata", "Kasya", "Tamkuhi Raj"],
      "Lalitpur": ["Lalitpur", "Mahroni", "Talbehat"],
      "Lucknow": ["Lucknow Sadar", "Bakshi Ka Talab", "Malihabad", "Mohanlalganj"],
      "Maharajganj": ["Maharajganj", "Nautanwa", "Nichlaul", "Pharenda"],
      "Mahoba": ["Mahoba", "Charkhari", "Kulpahar"],
      "Mainpuri": ["Mainpuri", "Bhongaon", "Karhal", "Kishni"],
      "Mathura": ["Mathura", "Chhata", "Mant", "Sadabad"],
      "Mau": ["Mau", "Ghosi", "Muhammadabad Gohna"],
      "Meerut": ["Meerut", "Mawana", "Sardhana"],
      "Mirzapur": ["Mirzapur", "Chunar", "Lalganj", "Marihan"],
      "Moradabad": ["Moradabad", "Bilari", "Kanth", "Thakurdwara"],
      "Muzaffarnagar": ["Muzaffarnagar", "Budhana", "Jannathpur", "Khatauli"],
      "Pilibhit": ["Pilibhit", "Bisalpur", "Puranpur"],
      "Pratapgarh": ["Pratapgarh", "Kunda", "Lalganj", "Patti", "Raniganj"],
      "Prayagraj": ["Prayagraj Sadar", "Bara", "Karchhana", "Meja", "Phulpur", "Soraon"],
      "Raebareli": ["Raebareli", "Lalganj", "Maharajganj", "Salon", "Unchahar"],
      "Rampur": ["Rampur", "Bilaspur", "Milak", "Shahabad", "Swar"],
      "Saharanpur": ["Saharanpur", "Deoband", "Nakur", "Behat", "Gangoh"],
      "Sambhal": ["Sambhal", "Chandausi", "Gunnaur"],
      "Sant Kabir Nagar": ["Khalilabad", "Dhanghata", "Mehdawal"],
      "Shahjahanpur": ["Shahjahanpur", "Jalalabad", "Powayan", "Tilhar"],
      "Shamli": ["Shamli", "Kairana", "Thana Bhawan"],
      "Shravasti": ["Bhinga", "Ikauna"],
      "Siddharthnagar": ["Naugarh", "Bansi", "Domariyaganj", "Itwa", "Shohratgarh"],
      "Sitapur": ["Sitapur", "Biswan", "Laharpur", "Maholi", "Misrikh", "Sidhauli"],
      "Sonbhadra": ["Robertsganj", "Duddhi", "Ghorawal"],
      "Sultanpur": ["Sultanpur", "Jaisinghpur", "Kadipur", "Lambhua"],
      "Unnao": ["Unnao", "Bangarman", "Hasanganj", "Purwa", "Safipur"],
      "Varanasi": ["Varanasi Sadar", "Pindra", "Rajatalab"],

      // Madhya Pradesh
      "Agar Malwa": ["Agar", "Badod", "Nalkheda", "Susner"],
      "Alirajpur": ["Alirajpur", "Jobat", "Katthiwada"],
      "Anuppur": ["Anuppur", "Jaithari", "Kotma", "Pushprajgarh"],
      "Ashoknagar": ["Ashoknagar", "Chanderi", "Isagarh", "Mungaoli"],
      "Balaghat": ["Balaghat", "Baihar", "Katangi", "Lanji", "Paraswada", "Waraseoni"],
      "Barwani": ["Barwani", "Anjad", "Pansemal", "Rajpur", "Sendhwa"],
      "Betul": ["Betul", "Amla", "Bhainsdehi", "Multai", "Shahpur"],
      "Bhind": ["Bhind", "Ater", "Gohad", "Lahar", "Mehgaon"],
      "Bhopal": ["Bhopal Sadar", "Berasia", "Kolar"],
      "Burhanpur": ["Burhanpur", "Khaknar", "Nepanagar"],
      "Chhatarpur": ["Chhatarpur", "Bada Malhera", "Bijawar", "Laundi", "Nowgong", "Rajnagar"],
      "Chhindwara": ["Chhindwara", "Amarwara", "Chourai", "Junardeo", "Pandhurna", "Parasia", "Sausar"],
      "Damoh": ["Damoh", "Hatta", "Jabera", "Patharia", "Tendukheda"],
      "Datia": ["Datia", "Bhander", "Seondha"],
      "Dewas": ["Dewas", "Bagli", "Kannod", "Khategaon", "Sonkatch", "Tonk Khurd"],
      "Dhar": ["Dhar", "Badnawar", "Dhamnod", "Kukshi", "Manawar", "Sardarpur"],
      "Dindori": ["Dindori", "Shahpura"],
      "Guna": ["Guna", "Aron", "Bamori", "Chhabra", "Raghogarh"],
      "Gwalior": ["Gwalior Sadar", "Bhantar", "Dabra", "Morar"],
      "Harda": ["Harda", "Handia", "Khirkiya", "Timarni"],
      "Narmadapuram": ["Narmadapuram", "Itarsi", "Pipariya", "Seoni Malwa", "Sohagpur"],
      "Indore": ["Indore", "Depalpur", "Hatod", "Mhow", "Sanwer"],
      "Jabalpur": ["Jabalpur", "Kundam", "Majholi", "Patan", "Shahpura", "Sihora"],
      "Jhabua": ["Jhabua", "Meghnagar", "Petlawad", "Ranapur", "Thandla"],
      "Katni": ["Katni", "Badwara", "Bahoriband", "Murwara", "Rithi", "Vijayraghavgarh"],
      "Khandwa": ["Khandwa", "Harsud", "Pandhana", "Punasa"],
      "Khargone": ["Khargone", "Barwaha", "Bhikangaon", "Kasrawad", "Maheshwar", "Sanawad"],
      "Mandla": ["Mandla", "Bichhiya", "Nainpur", "Niwas"],
      "Mandsaur": ["Mandsaur", "Bhanpura", "Garoth", "Malhargarh", "Sitamau"],
      "Morena": ["Morena", "Ambah", "Joura", "Kailaras", "Sabalgarh"],
      "Narsinghpur": ["Narsinghpur", "Gadarwara", "Gotegaon", "Kareli"],
      "Neemuch": ["Neemuch", "Jawad", "Manasa"],
      "Niwari": ["Niwari", "Orchha", "Prithvipur"],
      "Panna": ["Panna", "Ajaigarh", "Gunnaur", "Pawai", "Shahnagar"],
      "Raisen": ["Raisen", "Begamganj", "Gairatganj", "Gauharjganj", "Ghar", "Silwani"],
      "Rajgarh": ["Rajgarh", "Biaora", "Jeerapur", "Khilchipur", "Narsinghgarh", "Sarangpur"],
      "Ratlam": ["Ratlam", "Alot", "Jaora", "Ratlam Rural", "Sailana"],
      "Rewa": ["Rewa", "Gurh", "Hanumana", "Huzur", "Mauganj", "Teonthar"],
      "Sagar": ["Sagar", "Banda", "Bina", "Deori", "Khurai", "Rahatgarh"],
      "Satna": ["Satna", "Amarpatan", "Maihar", "Nagod", "Ramnagar", "Uchehara"],
      "Sehore": ["Sehore", "Ashta", "Budhni", "Ichhawar", "Nasarullaganj"],
      "Seoni": ["Seoni", "Barghat", "Ghansor", "Keolari", "Lakhnadon"],
      "Shahdol": ["Shahdol", "Beohari", "Jaisinghnagar", "Sohagpur"],
      "Shajapur": ["Shajapur", "Kalapipal", "Maksi", "Shujalpur"],
      "Sheopur": ["Sheopur", "Karatagaon", "Vijaypur"],
      "Shivpuri": ["Shivpuri", "Badarwas", "Karera", "Khaniadhana", "Kolaras", "Pohri"],
      "Sidhi": ["Sidhi", "Churhat", "Gopadbanas", "Majhauli", "Rampur Naikin"],
      "Singrauli": ["Singrauli", "Chitrangi", "Deosar"],
      "Tikamgarh": ["Tikamgarh", "Baldeogarh", "Jatara", "Palera"],
      "Ujjain": ["Ujjain", "Badnagar", "Nagda", "Khachrod", "Mahidpur", "Tarana"],
      "Umaria": ["Umaria", "Bhandhavgarh", "Manpur", "Pali"],
      "Vidisha": ["Vidisha", "Basoda", "Ganjbasoda", "Kurwai", "Lateri", "Sironj"],

      // Bihar
      "Araria": ["Araria", "Forbesganj", "Jokihat", "Raniganj", "Sikti"],
      "Arwal": ["Arwal", "Karpi", "Kaler"],
      "Aurangabad": ["Aurangabad", "Daudnagar", "Nabinagar", "Obra", "Rafiganj"],
      "Banka": ["Banka", "Amarpur", "Bounsi", "Katoria"],
      "Begusarai": ["Begusarai", "Bakhri", "Balia", "Barauni", "Teghra"],
      "Bhagalpur": ["Bhagalpur Sadar", "Kahalgaon", "Naugachhia"],
      "Bhojpur": ["Ara Sadar", "Jagdispur", "Piro"],
      "Buxar": ["Buxar", "Dumraon"],
      "Darbhanga": ["Darbhanga Sadar", "Benipur", "Biraul"],
      "East Champaran": ["Motihari", "Areraj", "Chakia", "Raxaul", "Sikrahana"],
      "Gaya": ["Gaya Sadar", "Neemchak Bathani", "Sherghati", "Tekari"],
      "Gopalganj": ["Gopalganj", "Hathua"],
      "Jamui": ["Jamui", "Gidhaur", "Jhajha", "Khaira"],
      "Jehanabad": ["Jehanabad", "Makhdumpur"],
      "Kaimur": ["Bhabua", "Mohania"],
      "Katihar": ["Katihar", "Barsoi", "Manihari"],
      "Khagaria": ["Khagaria", "Gogri"],
      "Kishanganj": ["Kishanganj", "Bahadurganj", "Thakurganj"],
      "Lakhisarai": ["Lakhisarai", "Surajgarha"],
      "Madhepura": ["Madhepura", "Udakishunganj"],
      "Madhubani": ["Madhubani", "Benipatti", "Jhanjharpur", "Phulparas", "Jainagar"],
      "Munger": ["Munger", "Haveli Kharagpur", "Tarapur"],
      "Muzaffarpur": ["Muzaffarpur East", "Muzaffarpur West", "Kanti", "Motipur"],
      "Nalanda": ["Bihar Sharif", "Hilsa", "Rajgir"],
      "Nawada": ["Nawada", "Rajauli"],
      "Patna": ["Patna Sadar", "Danapur", "Barh", "Masaurhi", "Paliganj", "Mokama"],
      "Purnia": ["Purnia Sadar", "Banmankhi", "Dhamdaha", "Baisi"],
      "Rohtas": ["Sasaram", "Dehri", "Bikramganj"],
      "Saharsa": ["Saharsa", "Simri Bakhtiyarpur"],
      "Samastipur": ["Samastipur", "Dalsinghsarai", "Rosera", "Patori"],
      "Saran": ["Chhapra Sadar", "Marhaura", "Sonepur"],
      "Sheikhpura": ["Sheikhpura", "Barbigha"],
      "Sheohar": ["Sheohar"],
      "Sitamarhi": ["Sitamarhi", "Bairgania", "Pupri"],
      "Siwan": ["Siwan", "Maharajganj"],
      "Supaul": ["Supaul", "Birpur", "Nirmali", "Triveniganj"],
      "Vaishali": ["Hajipur", "Mahua", "Mahnar"],
      "West Champaran": ["Bettiah", "Bagaha", "Narkatiaganj"],

      // West Bengal
      "Alipurduar": ["Alipurduar", "Falakata", "Kalchini", "Madarihat"],
      "Bankura": ["Bankura Sadar", "Bishnupur", "Khatra"],
      "Birbhum": ["Suri Sadar", "Bolpur", "Rampurhat"],
      "Cooch Behar": ["Cooch Behar Sadar", "Dinhata", "Mathabhanga", "Mekhliganj", "Tufanganj"],
      "Dakshin Dinajpur": ["Balurghat", "Gangarampur"],
      "Darjeeling": ["Darjeeling Sadar", "Kurseong", "Mirik"],
      "Hooghly": ["Chinsurah", "Chandannagar", "Serampore", "Arambagh"],
      "Howrah": ["Howrah Sadar", "Uluberia"],
      "Jalpaiguri": ["Jalpaiguri Sadar", "Malbazar"],
      "Jhargram": ["Jhargram"],
      "Kalimpong": ["Kalimpong"],
      "Kolkata": ["Kolkata North", "Kolkata South", "Kolkata Central"],
      "Malda": ["English Bazar", "Chanchal"],
      "Murshidabad": ["Berhampore", "Domkal", "Lalbagh", "Kandi", "Jangipur"],
      "Nadia": ["Krishnanagar", "Ranaghat", "Kalyani", "Tehatta"],
      "North 24 Parganas": ["Barasat", "Barrackpore", "Bidhannagar", "Basirhat", "Bangaon"],
      "Paschim Bardhaman": ["Asansol Sadar", "Durgapur"],
      "Paschim Medinipur": ["Midnapore Sadar", "Kharagpur", "Ghatal"],
      "Purba Bardhaman": ["Bardhaman Sadar North", "Bardhaman Sadar South", "Kalna", "Katwa"],
      "Purba Medinipur": ["Tamluk", "Contai", "Haldia", "Egra"],
      "Purulia": ["Purulia Sadar East", "Purulia Sadar West", "Raghunathpur", "Jhalda"],
      "South 24 Parganas": ["Alipore", "Baruipur", "Diamond Harbour", "Canning", "Kakdwip"],
      "Uttar Dinajpur": ["Raiganj", "Islampur"],

      // Delhi
      "Central Delhi": ["Civil Lines", "Kotwali", "Karol Bagh"],
      "East Delhi": ["Gandhi Nagar", "Preet Vihar", "Mayur Vihar"],
      "New Delhi": ["Chanakyapuri", "Connaught Place", "Vasant Vihar"],
      "North Delhi": ["Sadar Bazar", "Kotwali", "Civil Lines"],
      "North East Delhi": ["Seelampur", "Yamuna Vihar", "Karawal Nagar"],
      "North West Delhi": ["Kanjhawala", "Rohini", "Saraswati Vihar"],
      "Shahdara": ["Shahdara", "Seemapuri", "Vivek Vihar"],
      "South Delhi": ["Saket", "Hauz Khas", "Mehrauli"],
      "South East Delhi": ["Defence Colony", "Kalkaji", "Sarita Vihar"],
      "South West Delhi": ["Dwarka", "Najafgarh", "Vasant Vihar"],
      "West Delhi": ["Patel Nagar", "Punjabi Bagh", "Rajouri Garden"],

      // Goa
      "North Goa": ["Tiswadi", "Bardez", "Pernem", "Bicholim", "Sattari", "Ponda"],
      "South Goa": ["Salcete", "Mormugao", "Quepem", "Sanguem", "Canacona", "Dharabandora"],

      // Punjab
      "Amritsar": ["Amritsar I", "Amritsar II", "Ajnala", "Baba Bakala", "Majitha"],
      "Barnala": ["Barnala", "Tapa"],
      "Bathinda": ["Bathinda", "Maur", "Rampura Phul", "Talwandi Sabo"],
      "Faridkot": ["Faridkot", "Jaitu", "Kotkapura"],
      "Fatehgarh Sahib": ["Fatehgarh Sahib", "Amloh", "Khamanon"],
      "Fazilka": ["Fazilka", "Abohar", "Jalalabad"],
      "Firozpur": ["Firozpur", "Guru Har Sahai", "Zira"],
      "Gurdaspur": ["Gurdaspur", "Batala", "Dera Baba Nanak"],
      "Hoshiarpur": ["Hoshiarpur", "Dasuya", "Garhshankar", "Mukerian"],
      "Jalandhar": ["Jalandhar I", "Jalandhar II", "Nakodar", "Phillaur", "Shahkot"],
      "Kapurthala": ["Kapurthala", "Bholath", "Phagwara", "Sultanpur Lodhi"],
      "Ludhiana": ["Ludhiana East", "Ludhiana West", "Jagraon", "Khanna", "Payal", "Samrala"],
      "Malerkotla": ["Malerkotla", "Ahmedgarh"],
      "Mansa": ["Mansa", "Budhlada", "Sardulgarh"],
      "Moga": ["Moga", "Baghapurana", "Dharamkot", "Nihal Singh Wala"],
      "Pathankot": ["Pathankot", "Dhar Kalan"],
      "Patiala": ["Patiala", "Nabha", "Rajpura", "Samana", "Patran"],
      "Rupnagar": ["Rupnagar", "Anandpur Sahib", "Nangal"],
      "Sahibzada Ajit Singh Nagar": ["Mohali", "Kharar", "Dera Bassi"],
      "Sangrur": ["Sangrur", "Dhuri", "Moonak", "Sunam"],
      "Shaheed Bhagat Singh Nagar": ["Nawanshahr", "Banga", "Balachaur"],
      "Sri Muktsar Sahib": ["Muktsar", "Gidderbaha", "Malout"],
      "Tarn Taran": ["Tarn Taran", "Patti", "Khadur Sahib"],

      // Haryana
      "Ambala": ["Ambala", "Barara", "Naraingarh"],
      "Bhiwani": ["Bhiwani", "Bawani Khera", "Loharu", "Tosham"],
      "Charkhi Dadri": ["Charkhi Dadri", "Badhra"],
      "Faridabad": ["Faridabad", "Ballabgarh", "Badkhal"],
      "Fatehabad": ["Fatehabad", "Ratia", "Tohana"],
      "Gurugram": ["Gurugram", "Badshahpur", "Pataudi", "Sohna"],
      "Hisar": ["Hisar", "Adampur", "Barwala", "Hansi", "Narnaund"],
      "Jhajjar": ["Jhajjar", "Bahadurgarh", "Beri", "Matanhail"],
      "Jind": ["Jind", "Julana", "Narwana", "Safidon", "Uchana"],
      "Kaithal": ["Kaithal", "Guhla", "Kalayat", "Pundri"],
      "Karnal": ["Karnal", "Assandh", "Gharaunda", "Indri", "Nilokheri"],
      "Kurukshetra": ["Thanesar", "Pehowa", "Shahbad"],
      "Mahendragarh": ["Narnaul", "Mahendragarh", "Kanina"],
      "Nuh": ["Nuh", "Ferozepur Jhirka", "Punahana"],
      "Palwal": ["Palwal", "Hathin", "Hodal"],
      "Panchkula": ["Panchkula", "Kalka", "Raipur Rani"],
      "Panipat": ["Panipat", "Bapoli", "Israna", "Samalkha"],
      "Rewari": ["Rewari", "Bawal", "Kosli"],
      "Rohtak": ["Rohtak", "Meham", "Sampla"],
      "Sirsa": ["Sirsa", "Dabwali", "Ellenabad", "Rania"],
      "Sonipat": ["Sonipat", "Ganaur", "Gohana", "Kharkhoda"],
      "Yamunanagar": ["Jagadhri", "Radaur", "Sadhaura"],

      // Odisha
      "Angul": ["Angul", "Athamallik", "Talcher", "Pallahara"],
      "Balangir": ["Balangir", "Patnagarh", "Titilagarh", "Kantara"],
      "Balasore": ["Balasore", "Bhadrak", "Jaleswar", "Nilagiri", "Soro"],
      "Bargarh": ["Bargarh", "Padampur", "Attabira", "Sohela"],
      "Bhadrak": ["Bhadrak", "Basudevpur", "Dhamnagar", "Chandbali"],
      "Boudh": ["Boudh", "Kantamal", "Harbhanga"],
      "Cuttack": ["Cuttack", "Athagarh", "Banki", "Salepur"],
      "Deogarh": ["Deogarh", "Reamal", "Barkote"],
      "Dhenkanal": ["Dhenkanal", "Hindol", "Kamakhyanagar"],
      "Gajapati": ["Paralakhemundi", "Kashinagar", "R Udayagiri"],
      "Ganjam": ["Berhampur", "Chhatrapur", "Bhanjanagar", "Hinjilicut"],
      "Jagatsinghapur": ["Jagatsinghpur", "Paradip", "Tirtol"],
      "Jajpur": ["Jajpur", "Vyasanagar", "Binjharpur"],
      "Jharsuguda": ["Jharsuguda", "Brajarajnagar", "Belpahar"],
      "Kalahandi": ["Bhawanipatna", "Dharamgarh", "Junagarh"],
      "Kandamahal": ["Phulbani", "Balliguda", "G Udayagiri"],
      "Kendrapara": ["Kendrapara", "Pattamundai", "Rajkanika"],
      "Kendujhar": ["Keonjhar", "Anandapur", "Barbil", "Champua"],
      "Khordha": ["Bhubaneswar", "Khordha", "Jatani", "Banapur"],
      "Koraput": ["Koraput", "Jeypore", "Sunabeda", "Kotpad"],
      "Malkangiri": ["Malkangiri", "Chitrakonda", "Mathili"],
      "Mayurbhanj": ["Baripada", "Rairangpur", "Karanjia", "Udala"],
      "Nabarangpur": ["Nabarangpur", "Umerkote", "Dabugam"],
      "Nayagarh": ["Nayagarh", "Daspalla", "Ranpur"],
      "Nuapada": ["Nuapada", "Khariar", "Boden"],
      "Puri": ["Puri", "Pipili", "Nimapara", "Brahmagiri"],
      "Rayagada": ["Rayagada", "Gunupur", "Bissam Cuttack"],
      "Sambalpur": ["Sambalpur", "Rairakhol", "Kuchinda"],
      "Subarnapur": ["Sonepur", "Birmaharajpur", "Tarbha"],
      "Sundargarh": ["Sundargarh", "Rourkela", "Rajgangpur", "Bonai"],

      // Himachal Pradesh
      "Bilaspur": ["Bilaspur", "Ghumarwin", "Jhandutta", "Swarghat"],
      "Chamba": ["Chamba", "Bharmour", "Churah", "Dalhousie", "Pangi"],
      "Hamirpur": ["Hamirpur", "Barsar", "Bhoranj", "Nadaun", "Sujanpur"],
      "Kangra": ["Dharamshala", "Kangra", "Palampur", "Nurpur", "Dehra", "Jawalaji"],
      "Kinnaur": ["Kalpa", "Nichar", "Pooh"],
      "Kullu": ["Kullu", "Manali", "Anni", "Banjar", "Nirmand"],
      "Lahaul and Spiti": ["Keylong", "Udaipur", "Kaza"],
      "Mandi": ["Mandi", "Sunder Nagar", "Sarkaghat", "Joginder Nagar", "Karsog"],
      "Shimla": ["Shimla", "Rampur", "Rohru", "Theog", "Chopal", "Jubbal"],
      "Sirmaur": ["Nahan", "Paonta Sahib", "Rajgarh", "Shillai"],
      "Solan": ["Solan", "Arki", "Baddi", "Kasauli", "Nalagadh"],
      "Una": ["Una", "Amb", "Bangana", "Gagret", "Haroli"],

      // Uttarakhand
      "Almora": ["Almora", "Bhikiyasain", "Dwarahat", "Ranikhet", "Someshwar"],
      "Bageshwar": ["Bageshwar", "Kapkot", "Garur"],
      "Chamoli": ["Gopeshwar", "Joshi Math", "Karnaprayag", "Tharali"],
      "Champawat": ["Champawat", "Lohaghat", "Pati", "Tanakpur"],
      "Dehradun": ["Dehradun", "Chakrata", "Kalsi", "Rishikesh", "Vikas Nagar"],
      "Haridwar": ["Haridwar", "Laksar", "Roorkee"],
      "Nainital": ["Nainital", "Haldwani", "Kaladhungi", "Lalkuan", "Ramnagar"],
      "Pauri Garhwal": ["Pauri", "Kotdwar", "Lansdowne", "Srinagar"],
      "Pithoragarh": ["Pithoragarh", "Berinag", "Dharchula", "Didihat", "Gangolihat"],
      "Rudraprayag": ["Rudraprayag", "Augustmuni", "Ukhimath"],
      "Tehri Garhwal": ["Tehri", "Devprayag", "Ghanali", "Narendranagar", "Pratapnagar"],
      "Udham Singh Nagar": ["Rudraptur", "Kashipur", "Khatima", "Kichha", "Sitarganj"],
      "Uttarkashi": ["Uttarkashi", "Bhatwari", "Dunda", "Purola"]
,

      // Additional States & Union Territories
      "Anjaw": ["Hawai","Hayuliang","Manchal","Goiliang","Chaglagam","Walong"],
      "Changlang": ["Changlang","Manmao","Jairampur","Miao","Diyun","Bordumsa","Kharsang"],
      "Dibang Valley": ["Anini","Etalin","Anelih","Mipi","Kronli"],
      "East Kameng": ["Seppa","Chayangtajo","Bameng","Lada","Bana","Pakke-Kessang"],
      "East Siang": ["Pasighat","Mebo","Namsing","Sille-Oyan","Ruksin"],
      "Kamle": ["Raga","Dollungmukh","Koyu","Puchigeko"],
      "Kra Daadi": ["Palin","Nyapin","Yangte","Tali","Chambang"],
      "Kurung Kumey": ["Koloriang","Sangram","Nyapin","Damin","Parsiparlo"],
      "Lepa Rada": ["Basar","Daring","Sibe","Tirbin"],
      "Lohit": ["Tezu","Sunpura","Wakro"],
      "Longding": ["Longding","Kanubari","Pongchau","Wakka"],
      "Lower Dibang Valley": ["Roing","Dambuk","Hunli","Desali"],
      "Lower Subansiri": ["Ziro","Yachuli","Pistana","Kamporijo"],
      "Namsai": ["Namsai","Chowkham","Lekang"],
      "Pakke Kessang": ["Lemmi","Pakke-Kessang","Passa Valley","Dissing Passo"],
      "Papum Pare": ["Yupia","Itanagar","Naharlagun","Doimukh","Sagalee","Kimin","Toru"],
      "Shi Yomi": ["Tato","Mechuka","Pidi","Monigong"],
      "Siang": ["Pangin","Boleng","Kaying","Rumgong"],
      "Tawang": ["Tawang","Jang","Lumla","Mukto","Kitpi"],
      "Tirap": ["Khonsa","Deomali","Lazu","Borduria"],
      "Upper Siang": ["Yingkiong","Mariyang","Tuting","Geku"],
      "Upper Subansiri": ["Daporijo","Dumporijo","Taliha","Nacho","Baririjo"],
      "West Kameng": ["Bomdila","Dirang","Kalaktang","Rupa","Singchung","Bhalukpong"],
      "West Siang": ["Aalo","Yomcha","Kamba","Liromoba"],
      "Baksa": ["Mushalpur","Salbari","Tamulpur"],
      "Barpeta": ["Barpeta","Kalgachia","Sarupeta","Bajali"],
      "Biswanath": ["Biswanath Chariali","Gohpur","Helem"],
      "Bongaigaon": ["Bongaigaon","Bijni","Manikpur"],
      "Cachar": ["Silchar","Lakhipur","Sonai","Katigorah"],
      "Charaideo": ["Sonari","Mahmora","Sapekhati"],
      "Chirang": ["Kajalgaon","Bijni","Sidli"],
      "Darrang": ["Mangaldai","Sipajhar","Kharupetia"],
      "Dhemaji": ["Dhemaji","Jonai","Silapathar"],
      "Dhubri": ["Dhubri","Gauripur","Bilasipara","Golakganj"],
      "Dibrugarh": ["Dibrugarh","Moran","Naharkatia","Tingkhong","Chabua"],
      "Dima Hasao": ["Haflong","Mahur","Umrangso","Maibang"],
      "Goalpara": ["Goalpara","Dudhnoi","Matia","Lakhipur"],
      "Golaghat": ["Golaghat","Bokakhat","Sarupathar","Dergaon"],
      "Hailakandi": ["Hailakandi","Lala","Algapur","Katlicherra"],
      "Hojai": ["Hojai","Doboka","Lanka"],
      "Jorhat": ["Jorhat","Titabor","Teok"],
      "Kamrup": ["Amingaon","Rangia","Boko","Chaygaon"],
      "Kamrup Metropolitan": ["Guwahati","Dispur","Chandrapur","Sonapur"],
      "Karbi Anglong": ["Diphu","Bokajan","Howraghat","Phuloni"],
      "Karimganj": ["Karimganj","Badarpur","Nilambazar","Patharkandi"],
      "Kokrajhar": ["Kokrajhar","Gossaigaon","Dotoma"],
      "Lakhimpur": ["North Lakhimpur","Bihpuria","Dhakuakhana","Narayanpur"],
      "Majuli": ["Garamur","Kamalabari","Joramuri"],
      "Morigaon": ["Morigaon","Bhuragaon","Laharighat","Jagiroad"],
      "Nagaon": ["Nagaon","Raha","Kaliabor","Samaguri","Kampur"],
      "Nalbari": ["Nalbari","Tihu","Barbhag","Ghograpar"],
      "Sivasagar": ["Sivasagar","Nazira","Amguri","Demow"],
      "Sonitpur": ["Tezpur","Dhekiajuli","Jamugurihat","Rangapara"],
      "South Salmara-Mankachar": ["Hatsingimari","Mankachar"],
      "Tinsukia": ["Tinsukia","Margherita","Doomdooma","Digboi"],
      "Udalguri": ["Udalguri","Harisinga","Rowta","Mazbat"],
      "West Karbi Anglong": ["Hamren","Baithalangso","Donkamokam"],
      "Balod": ["Balod","Dondilohara","Gurur","Gunderdehi","Sanwari"],
      "Baloda Bazar": ["Baloda Bazar","Bhatapara","Kasdol","Simga","Palari"],
      "Bastar": ["Jagdalpur","Bastar","Bakawand","Bhanpuri","Lohandiguda"],
      "Bemetara": ["Bemetara","Berla","Nawagarh","Saja"],
      "Bijapur": ["Bijapur","Bhairamgarh","Bhopalpatnam","Usur"],
      "Dantewada": ["Dantewada","Gidam","Kuakonda","Katekalyan"],
      "Dhamtari": ["Dhamtari","Kurud","Nagri","Magarlod"],
      "Durg": ["Durg","Bhilai","Patan","Dhamdha"],
      "Gariaband": ["Gariaband","Rajim","Chhura","Mainpur","Deobhog"],
      "Gaurela-Pendra-Marwahi": ["Pendra","Gaurela","Marwahi"],
      "Janjgir-Champa": ["Janjgir","Champa","Akaltara","Nawagarh","Pamgarh"],
      "Jashpur": ["Jashpur Nagar","Kunkuri","Pathalgaon","Bagicha"],
      "Kabirdham": ["Kawardha","Bodla","Pandariya","Sahaspur Lohara"],
      "Kanker": ["Kanker","Bhanupratappur","Charama","Keshkal","Antagarh"],
      "Khairagarh": ["Khairagarh","Chhuikhadan","Gandai"],
      "Kondagaon": ["Kondagaon","Keshkal","Farasgaon","Makdi"],
      "Korba": ["Korba","Katghora","Pali","Kartala","Hardi Bazar"],
      "Koriya": ["Baikunthpur","Manendragarh","Sonhat","Khadgawan"],
      "Mahasamund": ["Mahasamund","Bagbahra","Pithora","Saraipali","Basna"],
      "Manendragarh": ["Manendragarh","Chirmiri","Bharatpur"],
      "Mohla-Manpur": ["Mohla","Manpur","Ambagarh Chauki"],
      "Mungeli": ["Mungeli","Lormi","Pathariya"],
      "Narayanpur": ["Narayanpur","Orcha"],
      "Raigarh": ["Raigarh","Kharsia","Gharghoda","Sarangarh","Tamnar"],
      "Raipur": ["Raipur","Abhanpur","Arang","Tilda Newra"],
      "Rajnandgaon": ["Rajnandgaon","Dongargarh","Dongargaon","Chhuriya"],
      "Sarangarh-Bilaigarh": ["Sarangarh","Bilaigarh","Baramkela"],
      "Sakti": ["Sakti","Dabhra","Jaijaipur","Malkharoda"],
      "Sukma": ["Sukma","Konta","Chhindgarh"],
      "Surajpur": ["Surajpur","Ramanujnagar","Odgi","Pratappur","Bhaiya Than"],
      "Surguja": ["Ambikapur","Sitapur","Lundra","Udaipur","Lakhanpur"],
      "Bokaro": ["Chas","Bermo","Gomia","Chandankiyari","Jaridih"],
      "Chatra": ["Chatra","Simaria","Hunterganj","Tandwa","Itkhori"],
      "Deoghar": ["Deoghar","Madhupur","Sarath","Mohanpur","Palojori"],
      "Dhanbad": ["Dhanbad","Jharia","Baghmara","Nirsa","Govindpur","Tundi"],
      "Dumka": ["Dumka","Jarmundi","Jama","Masalia","Raneshwar","Shikaripara"],
      "East Singhbhum": ["Jamshedpur","Ghatshila","Potka","Musabani","Baharagora"],
      "Garhwa": ["Garhwa","Nagar Untari","Ranka","Majhiaon","Bhavnathpur"],
      "Giridih": ["Giridih","Dumri","Bagodar","Rajdhanwar","Jamua","Tisri"],
      "Godda": ["Godda","Mahagama","Pathargama","Poraiyahat","Mehma"],
      "Gumla": ["Gumla","Chainpur","Basia","Raidih","Palkot","Sisai"],
      "Hazaribagh": ["Hazaribagh","Barhi","Barkagaon","Mandu","Bishnugarh"],
      "Jamtara": ["Jamtara","Nala","Mihijam","Narayanpur"],
      "Khunti": ["Khunti","Murhu","Torpa","Karra","Rania"],
      "Koderma": ["Koderma","Jhumri Telaiya","Jainagar","Markacho"],
      "Latehar": ["Latehar","Chandwa","Balumath","Mahuadanr","Manika"],
      "Lohardaga": ["Lohardaga","Kuru","Bhandra","Senha"],
      "Pakur": ["Pakur","Maheshpur","Littipara","Pakuria","Hiranpur"],
      "Palamu": ["Daltonganj","Medininagar","Hussainabad","Chhatarpur","Bishrampur"],
      "Ramgarh": ["Ramgarh","Patratu","Gola","Mandu"],
      "Ranchi": ["Ranchi","Kanke","Hatia","Namkum","Ormanjhi","Mandar","Bundu"],
      "Sahebganj": ["Rajmahal","Sahibganj","Barharwa","Borio","Taljhari"],
      "Seraikela Kharsawan": ["Seraikela","Adityapur","Chandil","Kharsawan"],
      "Simdega": ["Simdega","Kolebira","Bano","Kurdeg","Bolba"],
      "West Singhbhum": ["Chaibasa","Chakradharpur","Jagannathpur","Manoharpur"],
      "Bishnupur": ["Bishnupur","Moirang","Nambol"],
      "Chandel": ["Chandel","Chakpikarong","Khengjoy"],
      "Churachandpur": ["Churachandpur","Singngat","Thanlon","Tuibong"],
      "Imphal East": ["Porompat","Keirao Bitra","Sawombung"],
      "Imphal West": ["Lamphelpat","Patsoi","Wangoi"],
      "Jiribam": ["Jiribam","Borobekra"],
      "Kakching": ["Kakching","Waikhong"],
      "Kamjong": ["Kamjong","Sahamphung","Kasom Khullen"],
      "Kangpokpi": ["Kangpokpi","Saikul","Saitu Gamphazol"],
      "Noney": ["Longmai","Nungba","Khoupum"],
      "Pherzawl": ["Pherzawl","Parbung","Vangai Range"],
      "Senapati": ["Senapati","Mao Maram","Tadubi","Paomata"],
      "Tamenglong": ["Tamenglong","Tamei","Tousem"],
      "Tengnoupal": ["Tengnoupal","Moreh","Machi"],
      "Thoubal": ["Thoubal","Lilong","Heirok"],
      "Ukhrul": ["Ukhrul","Chingai","Litan"],
      "East Garo Hills": ["Williamnagar","Rongjeng","Samanda"],
      "East Jaintia Hills": ["Khliehriat","Saipung"],
      "East Khasi Hills": ["Shillong","Pynursla","Sohra","Mawphlang","Mawryngkneng"],
      "Eastern West Khasi Hills": ["Mairang","Mawthadraishan"],
      "North Garo Hills": ["Resubelpara","Bajengdoba","Kharkutta"],
      "Ri Bhoi": ["Nongpoh","Umling","Jirang","Umsning"],
      "South Garo Hills": ["Baghmara","Chokpot","Rongara"],
      "South West Garo Hills": ["Ampati","Betasing","Zikzak"],
      "South West Khasi Hills": ["Mawkyrwat","Ranikor"],
      "West Garo Hills": ["Tura","Rongram","Dadenggre","Tikrikilla","Selsella"],
      "West Jaintia Hills": ["Jowai","Thadlaskein","Laskein","Amlarem"],
      "West Khasi Hills": ["Nongstoin","Mawshynrut"],
      "Aizawl": ["Aizawl East","Aizawl West","Tlangnuam","Darlawn","Thingsulthliah"],
      "Champhai": ["Champhai","Khawzawl","Ngopa"],
      "Hnahthial": ["Hnahthial","South Vanlaiphai"],
      "Khawzawl": ["Khawzawl","Rabung"],
      "Kolasib": ["Kolasib","Bilkhawthlir","Thingdawl"],
      "Lawngtlai": ["Lawngtlai","Sangau","Chawngte"],
      "Lunglei": ["Lunglei","West Bunghmun"],
      "Mamit": ["Mamit","Zawlnuam","Reiek"],
      "Saitual": ["Saitual","Phullen"],
      "Siaha": ["Siaha","Tipa"],
      "Serchhip": ["Serchhip","East Lungdar","Thenzawl"],
      "ChÃ¼moukedima": ["ChÃ¼moukedima","Medziphema","Dhansiripar"],
      "Dimapur": ["Dimapur","Kuhuboto"],
      "Kiphire": ["Kiphire","Pungro","Seyochung"],
      "Kohima": ["Kohima","Chiephobozou","Sechu-Zubza"],
      "Longleng": ["Longleng","Tamlu","Yachem"],
      "Mokokchung": ["Mokokchung","Tuli","Changtongya","Mangkolemba"],
      "Mon": ["Mon","Tizit","Aboi","Tobu","Chen"],
      "Niuland": ["Niuland","Nihokhu"],
      "Noklak": ["Noklak","Thonoknyu"],
      "Peren": ["Peren","Jalukie","Tening"],
      "Phek": ["Phek","Pfutsero","Meluri","Chozuba"],
      "Shamator": ["Shamator","Chessore"],
      "Tseminyu": ["Tseminyu","Chunlikha"],
      "Tuensang": ["Tuensang","Longkhim"],
      "Wokha": ["Wokha","Bhandari","Sanis","Baghty"],
      "Zunheboto": ["Zunheboto","Akuluto","Pughoboto","Satakha","Suruhuto"],
      "Gangtok": ["Gangtok","Khamdong","Tadong"],
      "Gyalshing": ["Gyalshing","Dentam","Tashiding"],
      "Pakyong": ["Pakyong","Rangpo","Rhenock"],
      "Soreng": ["Soreng","Jorethang"],
      "Mangan": ["Mangan","Chungthang","Lachen","Lachung"],
      "Namchi": ["Namchi","Ravangla","Mellidara"],
      "Dhalai": ["Ambassa","Kamalpur","Gandacherra","Longtharai Valley"],
      "Gomati": ["Udaipur","Amarpur","Karbook"],
      "Khowai": ["Khowai","Teliamura"],
      "North Tripura": ["Dharmanagar","Kanchanpur","Panisagar"],
      "Sepahijala": ["Bishramganj","Sonamura","Jampuijala"],
      "South Tripura": ["Belonia","Santirbazar","Sabroom"],
      "Unakoti": ["Kailashahar","Kumarghat"],
      "West Tripura": ["Agartala","Jirania","Mohanpur","Hezamara"],
      "Nicobar": ["Car Nicobar","Nancowry","Great Nicobar"],
      "North and Middle Andaman": ["Mayabunder","Diglipur","Rangat"],
      "South Andaman": ["Port Blair","Ferrargunj","Little Andaman"],
      "Chandigarh": ["Central Chandigarh","East Chandigarh","West Chandigarh","South Chandigarh"],
      "Dadra and Nagar Haveli": ["Silvassa","Khanvel"],
      "Daman": ["Daman Sadar","Nani Daman","Moti Daman"],
      "Diu": ["Diu Town","Ghoghla","Bucharwada"],
      "Anantnag": ["Anantnag","Bijbehara","Dooru","Pahalgam","Kokernag","Shangus"],
      "Bandipora": ["Bandipora","Gurez","Sumbal"],
      "Baramulla": ["Baramulla","Sopore","Uri","Pattan","Tangmarg","Gulmarg"],
      "Budgam": ["Budgam","Chadoora","Magam","Beerwah","Khansahib"],
      "Doda": ["Doda","Bhaderwah","Thathri","Gandoh"],
      "Ganderbal": ["Ganderbal","Kangan","Tulmulla"],
      "Jammu": ["Jammu","Akhnoor","R S Pura","Bishnah","Nagrota"],
      "Kathua": ["Kathua","Hiranagar","Basohli","Billawar","Bani"],
      "Kishtwar": ["Kishtwar","Padder","Marwah","Chhatroo"],
      "Kulgam": ["Kulgam","Devsar","DH Pora","Yaripora"],
      "Kupwara": ["Kupwara","Handwara","Karnah","Sogam","Trehgam"],
      "Poonch": ["Poonch","Mendhar","Haveli","Surankote"],
      "Pulwama": ["Pulwama","Pampore","Tral","Awantipora"],
      "Rajouri": ["Rajouri","Nowshera","Kalakote","Thanamandi","Kotranka"],
      "Ramban": ["Ramban","Banihal","Batote","Gool"],
      "Reasi": ["Reasi","Katra","Pouni","Mahore"],
      "Samba": ["Samba","Vijaypur","Ramgarh"],
      "Shopian": ["Shopian","Zainapora"],
      "Srinagar": ["Srinagar North","Srinagar South","Srinagar Central","Khanyar","Eidgah"],
      "Udhampur": ["Udhampur","Ramnagar","Chenani","Majalta"],
      "Kargil": ["Kargil","Zanskar","Sankoo","Shakar Chiktan","Drass"],
      "Leh": ["Leh","Nubra","Khaltsi","Nyoma","Durbuk"],
      "Lakshadweep": ["Kavaratti","Agatti","Amini","Andrott","Minicoy","Kadmat","Kalpeni","Chetlat","Kiltan","Bitra"],
      "Karaikal": ["Karaikal Town","Thirunallar","Nedungadu","Kottucherry","TR Pattinam","Neravy"],
      "Mahe": ["Mahe Town","Pandakkal"],
      "Puducherry": ["Puducherry Town","Ozhukarai","Villianur","Bahour"],
      "Yanam": ["Yanam Town","Savithri Nagar"]
    };

    

/**
 * Common State Name Aliases & Normalization
 */
const STATE_ALIASES = {
  'KA': 'Karnataka',
  'KAR': 'Karnataka',
  'AP': 'Andhra Pradesh',
  'TS': 'Telangana',
  'TG': 'Telangana',
  'TN': 'Tamil Nadu',
  'KL': 'Kerala',
  'KER': 'Kerala',
  'MH': 'Maharashtra',
  'MAHA': 'Maharashtra',
  'GA': 'Goa',
  'GJ': 'Gujarat',
  'GUJ': 'Gujarat',
  'DL': 'Delhi',
  'NCT': 'Delhi',
  'UP': 'Uttar Pradesh',
  'MP': 'Madhya Pradesh',
  'RJ': 'Rajasthan',
  'WB': 'West Bengal',
  'OD': 'Odisha',
  'OR': 'Odisha',
  'PB': 'Punjab',
  'HR': 'Haryana',
  'UK': 'Uttarakhand',
  'UA': 'Uttarakhand',
  'HP': 'Himachal Pradesh',
  'JK': 'Jammu and Kashmir',
  'LA': 'Ladakh',
  'AS': 'Assam',
  'BR': 'Bihar',
  'CG': 'Chhattisgarh',
  'CT': 'Chhattisgarh',
  'JH': 'Jharkhand',
  'TR': 'Tripura',
  'ML': 'Meghalaya',
  'MN': 'Manipur',
  'MZ': 'Mizoram',
  'NL': 'Nagaland',
  'SK': 'Sikkim',
  'AR': 'Arunachal Pradesh',
  'PY': 'Puducherry',
  'CH': 'Chandigarh',
  'AN': 'Andaman and Nicobar Islands'
};

/**
 * Common District Name Aliases (Historical, local & alternative spellings)
 */
const DISTRICT_ALIASES = {
  'bangalore': 'Bengaluru Urban',
  'bangalore urban': 'Bengaluru Urban',
  'bangalore south': 'Bengaluru Urban',
  'bangalore north': 'Bengaluru Urban',
  'bangalore central': 'Bengaluru Urban',
  'bengaluru': 'Bengaluru Urban',
  'bangalore rural': 'Bengaluru Rural',
  'mysore': 'Mysuru',
  'mysore district': 'Mysuru',
  'mysuru district': 'Mysuru',
  'belgaum': 'Belagavi',
  'bellary': 'Ballari',
  'bijapur': 'Vijayapura',
  'gulbarga': 'Kalaburagi',
  'shimoga': 'Shivamogga',
  'chikmagalur': 'Chikkamagaluru',
  'chikballapur': 'Chikkaballapura',
  'chikkaballapur': 'Chikkaballapura',
  'mangalore': 'Dakshina Kannada',
  'mangaluru': 'Dakshina Kannada',
  'south canara': 'Dakshina Kannada',
  'north canara': 'Uttara Kannada',
  'karwar': 'Uttara Kannada',
  'hubballi': 'Dharwad',
  'hubli': 'Dharwad',
  'dharwar': 'Dharwad',
  'tumkur': 'Tumakuru',
  'coorg': 'Kodagu',
  'madikeri': 'Kodagu',
  'davangere': 'Davanagere',
  'hospet': 'Vijayanagara',
  'vijayanagar': 'Vijayanagara',
  'bagalkote': 'Bagalkot',
  'chennai': 'Chennai',
  'madras': 'Chennai',
  'bombay': 'Mumbai City',
  'mumbai': 'Mumbai City',
  'trivandrum': 'Thiruvananthapuram',
  'calicut': 'Kozhikode',
  'cochin': 'Ernakulam',
  'kochi': 'Ernakulam',
  'trichy': 'Tiruchirappalli',
  'pondicherry': 'Puducherry',
  'vizag': 'Visakhapatnam'
};

/**
 * Normalize text for fuzzy matching
 */
function normalizeLocationString(str) {
  if (!str) return '';
  return str.toString()
    .toLowerCase()
    .replace(/\b(district|dist|taluk|taluka|taluku|mandal|tehsil|division|zone|city corporation|corporation|urban|rural)\b/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Find matching state in INDIA_LOCATION_DATA
 */
function findBestStateMatch(rawState) {
  if (!rawState) return 'Karnataka';
  const clean = rawState.trim();
  
  // Exact key match
  if (INDIA_LOCATION_DATA[clean]) return clean;

  // Alias lookup
  const upper = clean.toUpperCase();
  if (STATE_ALIASES[upper] && INDIA_LOCATION_DATA[STATE_ALIASES[upper]]) {
    return STATE_ALIASES[upper];
  }

  // Normalized search
  const normTarget = normalizeLocationString(clean);
  for (const stateName in INDIA_LOCATION_DATA) {
    if (normalizeLocationString(stateName) === normTarget) {
      return stateName;
    }
  }

  // Substring match
  for (const stateName in INDIA_LOCATION_DATA) {
    if (stateName.toLowerCase().includes(clean.toLowerCase()) || clean.toLowerCase().includes(stateName.toLowerCase())) {
      return stateName;
    }
  }

  return 'Karnataka'; // default
}

/**
 * Find matching district in selected state
 */
function findBestDistrictMatch(stateName, rawDistrict, rawCounty, rawCity) {
  const districts = INDIA_LOCATION_DATA[stateName] || INDIA_LOCATION_DATA['Karnataka'] || [];
  if (!districts.length) return '';

  const candidates = [rawDistrict, rawCounty, rawCity].filter(Boolean).map(c => c.toString().trim());

  // 1. Direct or alias checks
  for (const cand of candidates) {
    const candLower = cand.toLowerCase();
    
    // Check alias
    if (DISTRICT_ALIASES[candLower]) {
      const aliasTarget = DISTRICT_ALIASES[candLower];
      const foundInState = districts.find(d => d.toLowerCase() === aliasTarget.toLowerCase());
      if (foundInState) return foundInState;
    }

    // Direct case-insensitive match in state's district list
    const exact = districts.find(d => d.toLowerCase() === candLower);
    if (exact) return exact;

    // Direct match without "district"
    const candClean = candLower.replace(/\bdistrict\b/i, '').trim();
    const withoutDist = districts.find(d => d.toLowerCase() === candClean);
    if (withoutDist) return withoutDist;
  }

  // 2. Normalized match
  for (const cand of candidates) {
    const normCand = normalizeLocationString(cand);
    if (!normCand) continue;

    for (const dist of districts) {
      if (normalizeLocationString(dist) === normCand) {
        return dist;
      }
    }
  }

  // 3. Substring match
  for (const cand of candidates) {
    const cleanCand = cand.toLowerCase().replace(/\bdistrict\b/i, '').trim();
    if (cleanCand.length < 3) continue;

    for (const dist of districts) {
      const distLower = dist.toLowerCase();
      if (distLower.includes(cleanCand) || cleanCand.includes(distLower)) {
        return dist;
      }
    }
  }

  // 4. Check if any taluk in candidate belongs to a district in TALUK_LOCATION_DATA
  if (typeof TALUK_LOCATION_DATA !== 'undefined') {
    for (const cand of candidates) {
      const normCand = normalizeLocationString(cand);
      if (!normCand) continue;

      for (const distName in TALUK_LOCATION_DATA) {
        // Is distName in this state's district list?
        const matchingDist = districts.find(d => d.toLowerCase() === distName.toLowerCase());
        if (!matchingDist) continue;

        const taluks = TALUK_LOCATION_DATA[distName] || [];
        for (const t of taluks) {
          if (normalizeLocationString(t) === normCand) {
            return matchingDist;
          }
        }
      }
    }
  }

  // Fallback to first candidate if non-empty, or first district
  return districts[0] || '';
}

/**
 * Populate State Select Dropdown
 */
function populateStateDropdown(stateElemId, defaultState = 'Karnataka') {
  const stateSelect = document.getElementById(stateElemId);
  if (!stateSelect) return;

  const currentVal = stateSelect.value || defaultState || 'Karnataka';
  stateSelect.innerHTML = '<option value="">-- Select State / UT (India) --</option>';

  for (const stateName in INDIA_LOCATION_DATA) {
    const opt = document.createElement('option');
    opt.value = stateName;
    opt.textContent = stateName;
    if (stateName.toLowerCase() === currentVal.toLowerCase()) {
      opt.selected = true;
    }
    stateSelect.appendChild(opt);
  }
}

/**
 * Update District Select Dropdown based on chosen State
 */
function updateDistrictDropdown(stateElemId, districtElemId, selectedDistrict = '') {
  const stateSelect = document.getElementById(stateElemId);
  const districtSelect = document.getElementById(districtElemId);
  if (!stateSelect || !districtSelect) return;

  const chosenState = stateSelect.value || 'Karnataka';
  const targetDist = selectedDistrict || districtSelect.value || '';

  districtSelect.innerHTML = '<option value="">-- Select District --</option>';

  const districts = INDIA_LOCATION_DATA[chosenState] || [];
  let found = false;

  districts.forEach(distName => {
    const opt = document.createElement('option');
    opt.value = distName;
    opt.textContent = distName;
    if (targetDist && distName.toLowerCase() === targetDist.toLowerCase()) {
      opt.selected = true;
      found = true;
    }
    districtSelect.appendChild(opt);
  });

  // Preserve custom district if already saved and not in list
  if (targetDist && !found) {
    const customOpt = document.createElement('option');
    customOpt.value = targetDist;
    customOpt.textContent = targetDist;
    customOpt.selected = true;
    districtSelect.appendChild(customOpt);
  }
}

// Export for module systems or global window
if (typeof window !== 'undefined') {
  window.INDIA_LOCATION_DATA = INDIA_LOCATION_DATA;
  window.TALUK_LOCATION_DATA = TALUK_LOCATION_DATA;
  window.populateStateDropdown = populateStateDropdown;
  window.updateDistrictDropdown = updateDistrictDropdown;
  window.findBestStateMatch = findBestStateMatch;
  window.findBestDistrictMatch = findBestDistrictMatch;
  window.normalizeLocationString = normalizeLocationString;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    INDIA_LOCATION_DATA,
    TALUK_LOCATION_DATA,
    populateStateDropdown,
    updateDistrictDropdown,
    findBestStateMatch,
    findBestDistrictMatch,
    normalizeLocationString
  };
}
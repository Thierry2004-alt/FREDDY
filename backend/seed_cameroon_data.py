import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agridirect.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.models import FarmerProfile, BuyerProfile, DeliveryAgentProfile
from produce.models import Produce
from orders.models import Order
from delivery.models import Delivery
from datetime import date, timedelta

User = get_user_model()

def run_seed():
    print("Seeding Cameroon agricultural data...")

    # 1. Create Farmers
    f1, _ = User.objects.get_or_create(
        username="kamga_foumbot",
        defaults={
            "email": "kamga@agridirect.cm",
            "first_name": "Jean-Paul",
            "last_name": "Kamga",
            "role": "farmer",
            "phone_number": "+237677234567",
            "region": "Ouest (Foumbot)",
        }
    )
    f1.set_password("password123")
    f1.save()
    FarmerProfile.objects.get_or_create(
        user=f1,
        defaults={
            "farm_name": "Fermes Maraîchères du Noun",
            "farm_location": "Vallée Fertile de Foumbot, Ouest",
            "description": "Producteur certifié de tomates, poivrons et carottes de plein champ.",
            "is_verified": True
        }
    )

    f2, _ = User.objects.get_or_create(
        username="marie_penja",
        defaults={
            "email": "marie@agridirect.cm",
            "first_name": "Marie",
            "last_name": "Mballa",
            "role": "farmer",
            "phone_number": "+237675889900",
            "region": "Littoral (Njombé-Penja)",
        }
    )
    f2.set_password("password123")
    f2.save()
    FarmerProfile.objects.get_or_create(
        user=f2,
        defaults={
            "farm_name": "Plantations du Mont Koupe",
            "farm_location": "Njombé-Penja, Littoral",
            "description": "Exploitation de Poivre blanc de Penja IGP et plantain de premier choix.",
            "is_verified": True
        }
    )

    f3, _ = User.objects.get_or_create(
        username="bouba_maroua",
        defaults={
            "email": "bouba@agridirect.cm",
            "first_name": "El Hadj",
            "last_name": "Bouba",
            "role": "farmer",
            "phone_number": "+237699112233",
            "region": "Extrême-Nord (Maroua)",
        }
    )
    f3.set_password("password123")
    f3.save()
    FarmerProfile.objects.get_or_create(
        user=f3,
        defaults={
            "farm_name": "Coopérative des Oignons du Diamaré",
            "farm_location": "Maroua Périurbain, Extrême-Nord",
            "description": "Spécialiste de l'oignon rouge séché de longue conservation.",
            "is_verified": True
        }
    )

    # 2. Create Buyers
    b1, _ = User.objects.get_or_create(
        username="krystal_douala",
        defaults={
            "email": "achats@krystalpalace.cm",
            "first_name": "Nadine",
            "last_name": "Eboumbou",
            "role": "buyer",
            "phone_number": "+237671987654",
            "region": "Littoral (Douala)",
        }
    )
    b1.set_password("password123")
    b1.save()
    BuyerProfile.objects.get_or_create(
        user=b1,
        defaults={
            "business_name": "Hôtel Krystal Palace 5*",
            "business_type": "hotel",
            "address": "Boulevard de la Liberté, Bonanjo, Douala",
            "is_verified": True
        }
    )

    b2, _ = User.objects.get_or_create(
        username="hilton_yaounde",
        defaults={
            "email": "cuisine@hilton-yaounde.cm",
            "first_name": "Chef René",
            "last_name": "Atangana",
            "role": "buyer",
            "phone_number": "+237694123456",
            "region": "Centre (Yaoundé)",
        }
    )
    b2.set_password("password123")
    b2.save()
    BuyerProfile.objects.get_or_create(
        user=b2,
        defaults={
            "business_name": "Hôtel Hilton Yaoundé",
            "business_type": "hotel",
            "address": "Boulevard du 20 Mai, Centre-Ville, Yaoundé",
            "is_verified": True
        }
    )

    # 3. Create Delivery Agent
    d1, _ = User.objects.get_or_create(
        username="tchinda_express",
        defaults={
            "email": "logistics@camexpress.cm",
            "first_name": "Emmanuel",
            "last_name": "Tchinda",
            "role": "delivery",
            "phone_number": "+237673334455",
            "region": "Axe Lourd Douala - Bafoussam",
        }
    )
    d1.set_password("password123")
    d1.save()
    DeliveryAgentProfile.objects.get_or_create(
        user=d1,
        defaults={
            "vehicle_type": "Camionnette Frigorifique Isuzu 3.5T",
            "license_number": "LT-4829-NW",
            "current_location": "Échangeur Bekoko, Entrée Douala",
            "is_verified": True
        }
    )

    # 4. Create Cameroonian Produce (Prices in FCFA)
    today = date.today()
    produces_data = [
        {
            "farmer": f1,
            "name": "Tomates Fraîches de Foumbot",
            "category": "vegetables",
            "description": "Tomates fermes cueillies à maturité, idéales pour hôtels, restaurants et grossistes.",
            "quantity_available": 120,
            "unit": "cageot (50kg)",
            "price_per_unit": 25000,
            "harvest_date": today - timedelta(days=1),
            "expiry_date": today + timedelta(days=14),
            "location": "Foumbot, Région de l'Ouest",
            "is_organic": True,
        },
        {
            "farmer": f2,
            "name": "Poivre Blanc de Penja IGP",
            "category": "other",
            "description": "Poivre d'origine volcanique d'indication géographique protégée (IGP), saveur intense et arôme unique.",
            "quantity_available": 85,
            "unit": "kg",
            "price_per_unit": 18000,
            "harvest_date": today - timedelta(days=10),
            "expiry_date": today + timedelta(days=365),
            "location": "Njombé-Penja, Région du Littoral",
            "is_organic": True,
        },
        {
            "farmer": f3,
            "name": "Oignons Rouges Séchés de Maroua",
            "category": "vegetables",
            "description": "Oignons du Grand Nord très bien séchés, excellente conservation pour stockage et revente.",
            "quantity_available": 200,
            "unit": "sac (50kg)",
            "price_per_unit": 22000,
            "harvest_date": today - timedelta(days=7),
            "expiry_date": today + timedelta(days=90),
            "location": "Maroua, Région de l'Extrême-Nord",
            "is_organic": False,
        },
        {
            "farmer": f2,
            "name": "Régimes de Plantain Gros Michel",
            "category": "fruits",
            "description": "Plantains géants de Njombé, pulpe ferme parfaite pour frites, tapés et braisages gastronomiques.",
            "quantity_available": 90,
            "unit": "régime géant (30kg)",
            "price_per_unit": 4500,
            "harvest_date": today - timedelta(days=2),
            "expiry_date": today + timedelta(days=12),
            "location": "Njombé, Région du Littoral",
            "is_organic": True,
        },
        {
            "farmer": f1,
            "name": "Maïs Jaune Grain de Bafoussam",
            "category": "grains",
            "description": "Maïs sélectionné pour provenderies, brasseries artisanales et consommation humaine.",
            "quantity_available": 150,
            "unit": "sac (100kg)",
            "price_per_unit": 26000,
            "harvest_date": today - timedelta(days=15),
            "expiry_date": today + timedelta(days=180),
            "location": "Bafoussam rural, Ouest",
            "is_organic": True,
        },
        {
            "farmer": f2,
            "name": "Feuilles de Ndolé Fraîches Lavées",
            "category": "vegetables",
            "description": "Feuilles amères du Littoral soigneusement blanchies et prêtes à cuisiner pour la haute gastronomie.",
            "quantity_available": 60,
            "unit": "paquet (5kg)",
            "price_per_unit": 3500,
            "harvest_date": today,
            "expiry_date": today + timedelta(days=5),
            "location": "Dibombari, Littoral",
            "is_organic": True,
        },
    ]

    created_produces = []
    for p_data in produces_data:
        p, _ = Produce.objects.get_or_create(
            name=p_data["name"],
            farmer=p_data["farmer"],
            defaults=p_data
        )
        created_produces.append(p)

    # 5. Create Orders
    p_tomatoes = created_produces[0]
    p_poivre = created_produces[1]

    o1, _ = Order.objects.get_or_create(
        buyer=b1,
        produce=p_tomatoes,
        defaults={
            "quantity": 10,
            "unit_price": p_tomatoes.price_per_unit,
            "total_price": p_tomatoes.price_per_unit * 10,
            "delivery_address": "Hôtel Krystal Palace, Boulevard de la Liberté, Bonanjo, Douala",
            "delivery_notes": "Livraison matinale quai de réception marchandises avant 10h.",
            "status": "in_transit",
            "delivery_date": today,
            "notes": "Paiement garanti par Orange Money Cameroun",
        }
    )

    o2, _ = Order.objects.get_or_create(
        buyer=b2,
        produce=p_poivre,
        defaults={
            "quantity": 5,
            "unit_price": p_poivre.price_per_unit,
            "total_price": p_poivre.price_per_unit * 5,
            "delivery_address": "Hôtel Hilton Yaoundé, Boulevard du 20 Mai, Yaoundé",
            "delivery_notes": "Remettre au Chef de cuisine Atangana.",
            "status": "confirmed",
            "delivery_date": today + timedelta(days=1),
            "notes": "Paiement validé par MTN Mobile Money",
        }
    )

    # 6. Create Delivery Dispatch with Cameroon Corridor
    d_obj, _ = Delivery.objects.get_or_create(
        order=o1,
        defaults={
            "delivery_agent": d1,
            "pickup_location": "Coopérative Maraîchère, Foumbot (Ouest)",
            "dropoff_location": "Krystal Palace, Bonanjo, Douala (Littoral)",
            "current_location": "Axe Bafoussam - Douala (PK 85, Bekoko)",
            "status": "in_transit",
            "notes": "Chauffeur Emmanuel Tchinda (+237 673 33 44 55) - Véhicule LT-4829-NW",
        }
    )

    print("Cameroon agricultural dataset seeded successfully!")

if __name__ == "__main__":
    run_seed()

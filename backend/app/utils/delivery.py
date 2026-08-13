import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def is_within_radius(lat, lng, radius_km):
    kr_puram_lat = 13.0089
    kr_puram_lng = 77.7038
    dist = haversine(kr_puram_lat, kr_puram_lng, lat, lng)
    return dist <= radius_km

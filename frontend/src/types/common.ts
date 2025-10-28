// LatLng, TrustRank, etc.

export interface LatLng {
  lat: number
  lng: number
}

export interface Location {
  city: string
  state?: string
  lat: number
  lng: number
}

export type TrustRank = number

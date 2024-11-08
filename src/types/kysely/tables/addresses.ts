import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"

export interface AddressesTable {
	addressId: GeneratedAlways<number>
	city: string
	details: string | null
}

export type Address = Selectable<AddressesTable>

export type NewAddress = Insertable<AddressesTable>

export type AddressUpdate = Updateable<AddressesTable>

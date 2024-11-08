import type {
	GeneratedAlways,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { Address } from "./addresses"

export interface UsersTable {
	userId: GeneratedAlways<number>
	firstName: string
	lastName: string
	email: string
	password: string
	addressId: Address["addressId"]
	age: number
	note: number | null
}

export type User = Selectable<UsersTable>

export type NewUser = Insertable<UsersTable>

export type UserUpdate = Updateable<UsersTable>

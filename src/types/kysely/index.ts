import type {
	ColumnType,
	Expression,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"

export type Immutable<T> = ColumnType<T, T, never>

export type ViewBase<Base> = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	[property in keyof Base]: Base[property] extends ColumnType<infer T, any, any>
		? T
		: Base[property]
}

interface ViewDefinitions<View> {
	select: Selectable<View>
	insert: Insertable<View>
	update: Updateable<View>
	none: View
}

export type PolymorphicViewDefinition<
	View,
	Operation extends keyof ViewDefinitions<View> = "none",
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
> = View extends any ? ViewDefinitions<View>[Operation] : never

export type ResolvableExpression<T> = Expression<T> | T
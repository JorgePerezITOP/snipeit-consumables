export interface Item {
    id: number;
    name: string;
    category_id: number;
    qty: number;
    min_amt: number;
    created_at: string;
    updated_at: string;
}

export interface Consumable extends Item {
    type: 'consumable';
}

export interface Accessory extends Item {
    type: 'accessory';
}

export interface Category {
    id: number;
    name: string;
    type: string;
}

export interface ApiResponse<T> {
    total: number;
    rows: T[];
}

export interface DashboardStats {
    consumablesTotal: number;
    consumablesLow: number;
    accessoriesTotal: number;
    accessoriesLow: number;
} 
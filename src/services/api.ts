import axios from 'axios';
import { ApiResponse, Consumable, Accessory, Category, DashboardStats } from '../models/types';
import config from '../config';

const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export class SnipeITService {
    static async getConsumables(): Promise<ApiResponse<Consumable>> {
        const response = await api.get('/consumables');
        if (!response.data || !response.data.rows) {
            throw new Error('Invalid response from API');
        }
        return response.data;
    }

    static async getAccessories(): Promise<ApiResponse<Accessory>> {
        const response = await api.get('/accessories');
        if (!response.data || !response.data.rows) {
            throw new Error('Invalid response from API');
        }
        return response.data;
    }

    static async getCategories(): Promise<ApiResponse<Category>> {
        const response = await api.get('/categories');
        if (!response.data || !response.data.rows) {
            throw new Error('Invalid response from API');
        }
        return response.data;
    }

    static async createConsumable(data: Partial<Consumable>): Promise<Consumable> {
        const response = await api.post('/consumables', data);
        return response.data;
    }

    static async createAccessory(data: Partial<Accessory>): Promise<Accessory> {
        const response = await api.post('/accessories', data);
        return response.data;
    }

    static async updateConsumable(id: number, data: Partial<Consumable>): Promise<Consumable> {
        const response = await api.put(`/consumables/${id}`, data);
        return response.data;
    }

    static async updateAccessory(id: number, data: Partial<Accessory>): Promise<Accessory> {
        const response = await api.put(`/accessories/${id}`, data);
        return response.data;
    }

    static async deleteConsumable(id: number): Promise<void> {
        await api.delete(`/consumables/${id}`);
    }

    static async deleteAccessory(id: number): Promise<void> {
        await api.delete(`/accessories/${id}`);
    }

    static async getDashboardStats(): Promise<DashboardStats> {
        const [consumables, accessories] = await Promise.all([
            this.getConsumables(),
            this.getAccessories()
        ]);

        return {
            consumablesTotal: consumables.total,
            consumablesLow: consumables.rows.filter(c => c.qty <= c.min_amt).length,
            accessoriesTotal: accessories.total,
            accessoriesLow: accessories.rows.filter(a => a.qty <= a.min_amt).length
        };
    }
} 
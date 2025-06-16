import { SnipeITService } from './services/api';
import { Consumable, Accessory, Category } from './models/types';
import { Modal } from 'bootstrap';

class App {
    private currentSection: string = 'dashboard';
    private categories: Category[] = [];
    private consumablesMap: Record<number, Consumable> = {};
    private accessoriesMap: Record<number, Accessory> = {};
    private editingItemId: number | null = null;

    constructor() {
        this.initializeEventListeners();
        this.loadCategories();
        this.showSection('dashboard');
    }

    private initializeEventListeners(): void {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = (e.target as HTMLElement).dataset.section;
                if (section) {
                    this.showSection(section);
                }
            });
        });

        // Add buttons
        document.getElementById('addConsumableBtn')?.addEventListener('click', () => this.showItemModal('consumable'));
        document.getElementById('addAccessoryBtn')?.addEventListener('click', () => this.showItemModal('accessory'));

        // Save button
        document.getElementById('saveItemBtn')?.addEventListener('click', () => this.saveItem());
    }

    private async loadCategories(): Promise<void> {
        try {
            const response = await SnipeITService.getCategories();
            this.categories = response.rows;
        } catch (error) {
            console.error('Error loading categories:', error);
            alert('Error al cargar las categorías');
        }
    }

    private showSection(section: string): void {
        document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
        document.getElementById(section)?.classList.add('active');
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector(`[data-section="${section}"]`)?.classList.add('active');
        this.currentSection = section;

        if (section === 'dashboard') {
            this.loadDashboard();
        } else if (section === 'consumables') {
            this.loadConsumables();
        } else if (section === 'accessories') {
            this.loadAccessories();
        }
    }

    private async loadDashboard(): Promise<void> {
        try {
            const stats = await SnipeITService.getDashboardStats();
            document.getElementById('consumablesTotal')!.textContent = stats.consumablesTotal.toString();
            document.getElementById('consumablesLow')!.textContent = stats.consumablesLow.toString();
            document.getElementById('accessoriesTotal')!.textContent = stats.accessoriesTotal.toString();
            document.getElementById('accessoriesLow')!.textContent = stats.accessoriesLow.toString();
        } catch (error) {
            console.error('Error loading dashboard:', error);
            alert('Error al cargar el dashboard');
        }
    }

    private async loadConsumables(): Promise<void> {
        try {
            const response = await SnipeITService.getConsumables();
            const tbody = document.getElementById('consumablesTableBody')!;
            tbody.innerHTML = '';
            this.consumablesMap = {};

            response.rows.forEach(consumable => {
                this.consumablesMap[consumable.id] = consumable;
                const categoryName = (consumable as any).category?.name || this.getCategoryName(consumable.category_id);
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${consumable.name}</td>
                    <td>${categoryName}</td>
                    <td>${consumable.qty}</td>
                    <td>${consumable.min_amt}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-btn" data-id="${consumable.id}">Editar</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${consumable.id}">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            this.attachTableEventListeners('consumables');
        } catch (error) {
            console.error('Error loading consumables:', error);
            alert('Error al cargar los consumibles');
        }
    }

    private async loadAccessories(): Promise<void> {
        try {
            const response = await SnipeITService.getAccessories();
            const tbody = document.getElementById('accessoriesTableBody')!;
            tbody.innerHTML = '';
            this.accessoriesMap = {};

            response.rows.forEach(accessory => {
                this.accessoriesMap[accessory.id] = accessory;
                const categoryName = (accessory as any).category?.name || this.getCategoryName(accessory.category_id);
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${accessory.name}</td>
                    <td>${categoryName}</td>
                    <td>${accessory.qty}</td>
                    <td>${accessory.min_amt}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-btn" data-id="${accessory.id}">Editar</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${accessory.id}">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            this.attachTableEventListeners('accessories');
        } catch (error) {
            console.error('Error loading accessories:', error);
            alert('Error al cargar los accesorios');
        }
    }

    private getCategoryName(categoryId: number): string {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.name : 'Desconocida';
    }

    private attachTableEventListeners(type: 'consumables' | 'accessories'): void {
        const tbody = document.getElementById(`${type}TableBody`)!;
        tbody.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.target as HTMLElement).dataset.id;
                if (id) {
                    const item = type === 'consumables'
                        ? this.consumablesMap[parseInt(id)]
                        : this.accessoriesMap[parseInt(id)];
                    if (item) {
                        this.showItemModal(type === 'consumables' ? 'consumable' : 'accessory', item);
                    } else {
                        alert('No se encontró el item para editar.');
                    }
                }
            });
        });

        tbody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.target as HTMLElement).dataset.id;
                if (id) {
                    this.deleteItem(type, parseInt(id));
                }
            });
        });
    }

    private showItemModal(type: 'consumable' | 'accessory', item?: Consumable | Accessory): void {
        const modal = document.getElementById('itemModal')!;
        const modalTitle = document.getElementById('modalTitle')!;
        const form = document.getElementById('itemForm') as HTMLFormElement;

        modalTitle.textContent = item ? `Editar ${type === 'consumable' ? 'Consumible' : 'Accesorio'}` : 
            `Agregar ${type === 'consumable' ? 'Consumible' : 'Accesorio'}`;

        if (item) {
            this.editingItemId = item.id;
            (document.getElementById('itemName') as HTMLInputElement).value = item.name ?? '';
            (document.getElementById('itemNo') as HTMLInputElement).value = (item.item_no !== undefined && item.item_no !== null) ? item.item_no.toString() : '';
            (document.getElementById('itemQty') as HTMLInputElement).value = (item.qty !== undefined && item.qty !== null) ? item.qty.toString() : '';
            (document.getElementById('itemMin') as HTMLInputElement).value = (item.min_amt !== undefined && item.min_amt !== null) ? item.min_amt.toString() : '';
        } else {
            this.editingItemId = null;
            form.reset();
        }

        const modalInstance = new Modal(modal);
        modalInstance.show();
    }

    private async saveItem(): Promise<void> {
        const form = document.getElementById('itemForm') as HTMLFormElement;
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const data = {
            name: (document.getElementById('itemName') as HTMLInputElement).value,
            item_no: (document.getElementById('itemNo') as HTMLInputElement).value,
            qty: parseInt((document.getElementById('itemQty') as HTMLInputElement).value),
            min_amt: parseInt((document.getElementById('itemMin') as HTMLInputElement).value)
        };

        try {
            if (this.currentSection === 'consumables') {
                if (this.editingItemId) {
                    await SnipeITService.updateConsumable(this.editingItemId, data);
                } else {
                    await SnipeITService.createConsumable(data);
                }
                await this.loadConsumables();
            } else {
                if (this.editingItemId) {
                    await SnipeITService.updateAccessory(this.editingItemId, data);
                } else {
                    await SnipeITService.createAccessory(data);
                }
                await this.loadAccessories();
            }

            const modal = document.getElementById('itemModal')!;
            const modalInstance = Modal.getInstance(modal) || new Modal(modal);
            modalInstance.hide();
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Error al guardar el item');
        }
    }

    private async editItem(type: 'consumables' | 'accessories', id: number): Promise<void> {
        alert('Función de edición optimizada, este método ya no se usa.');
    }

    private async deleteItem(type: 'consumables' | 'accessories', id: number): Promise<void> {
        if (!confirm('¿Está seguro de que desea eliminar este item?')) {
            return;
        }

        try {
            if (type === 'consumables') {
                await SnipeITService.deleteConsumable(id);
                this.loadConsumables();
            } else {
                await SnipeITService.deleteAccessory(id);
                this.loadAccessories();
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error al eliminar el item');
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new App();
}); 
import { Router } from "express";
import { insertCategory, deleteCategory, editCategory, getAllCategoriesWithProducts } from '../database.js';

const router = new Router();

router.get("/", async (req, res) => {
    const rows = getAllCategoriesWithProducts.all();
    const categories = rows.map(category => ({
        ...category,
        products: JSON.parse(category.products).filter(p => p.id !== null)
    }));

    res.json({
        success: true,
        message: "",
        data: categories
    });
});

router.post("/", async (req, res) => {
    try {
        const { name } = req.body;
        if(!name) {
            return res.status(500).json({
                success: false,
                message: "El nombre no puede estar vacio!"
            });
        }

        const result = insertCategory.run({
            name
        });

        res.status(201).json({
            success: true,
            message: `La Categoria con nombre ${name} creada correctamente!`
        })
    } catch(err) {
        console.error('Error al guardar contacto:', err);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if(!id) {
            console.log("ID invalido");
            res.status(500).json({
                success: false,
                message: "ID invalido"
            });
        }

        if(!name) {
            return res.status(500).json({
                success: false,
                message: "El nombre no puede estar vacio!"
            });
        }

        const result = editCategory.run({
            id,
            name
        });

        res.json({
            success: true,
            message: "Categoria editada correctamente!",
        });

    } catch(err) {
        console.log("Error al intentar actualizar la categoria" ,err)
        res.status(500).json({
            success: false,
            message: "Error al intentar actualizar la categoria"
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if(!id) {
            return res.status(500).json({
                success: false,
                message: "El id es es invalido!"
            });
        }
        const result = deleteCategory.run(id);
        res.status(200).json({
            success: true,
            message: "Categoria eliminada con exito!"
        });
    } catch(err) {
        console.error("Error al intentar eliminar la categoria", err);
        res.status(500).json({
            success: false,
            message: "Error al intentar eliminar la categoria"
        });
    }

});

export default router;
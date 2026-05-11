import { Router } from "express";
import { insertProduct, deleteProduct, getAllProducts, editProduct } from '../database.js';

const router = new Router();

router.get("/", async (req, res) => {
    const products = getAllProducts.all();
    res.json({
        success: true,
        message: "",
        data: products
    });
});

router.post("/", async (req, res) => {
    try {
        const { name, price, category_id } = req.body;
        if(!name || !price || !category_id) {
            return res.status(500).json({
                success: false,
                message: "El nombre, el precio o el id de la categoria no pueden estar vacios!"
            });
        }

        const result = insertProduct.run({
            name,
            price,
            category_id
        });

        res.status(201).json({
            success: true,
            message: `El producto con nombre ${name} fue agreagado a la categoria con ID ${category_id}!`
        })
    } catch(err) {
        console.error('Error al intentar crear producto:', err);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

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

        if(!price) {
            return res.status(500).json({
                success: false,
                message: "El precio no puede estar vacio!"
            });
        }

        const result = editProduct.run({
            id,
            name,
            price
        });

        res.json({
            success: true,
            message: "Producto editado correctamente!",
        });

    } catch(err) {
        console.log("Error al intentar actualizar el producto" ,err)
        res.status(500).json({
            success: false,
            message: "Error al intentar actualizar el producto"
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
        const result = deleteProduct.run(id);

        res.status(200).json({
            success: true,
            message: "Producto eliminado con exito!"
        });
    } catch(err) {
        console.error("Error al intentar eliminar el producto", err);
        res.status(500).json({
            success: false,
            message: "Error al intentar eliminar el producto"
        });
    }
    

});

export default router;
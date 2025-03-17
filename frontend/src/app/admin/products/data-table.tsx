import DeleteConfirm from "@/components/delete-confirm";

// Trong component DataTable
const handleDelete = async (id: string) => {
    try {
        await axios.delete(`/api/products/${id}`);
        toast.success("Xóa sản phẩm thành công");
        // Refresh data
    } catch (error) {
        toast.error("Có lỗi xảy ra khi xóa sản phẩm");
    }
};

// Trong phần render
<DeleteConfirm
    onDelete={() => handleDelete(product._id)}
    title="Xóa sản phẩm?"
    description="Bạn chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
/>;

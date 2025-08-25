// وظائف صفحة عرض المنتج
document.addEventListener('DOMContentLoaded', function() {

    // تفعيل التبويبات
    const tabElements = document.querySelectorAll('.kt-tab-toggle');
    tabElements.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();

            // إزالة الحالة النشطة من جميع التبويبات
            tabElements.forEach(t => {
                t.classList.remove('active', 'border-primary', 'text-primary');
                t.classList.add('border-transparent', 'text-muted-foreground');
            });

            // إخفاء جميع المحتويات
            const contentElements = document.querySelectorAll('[id$="-tab"]');
            contentElements.forEach(content => {
                content.classList.add('hidden');
            });

            // تفعيل التبويب المحدد
            this.classList.add('active', 'border-primary', 'text-primary');
            this.classList.remove('border-transparent', 'text-muted-foreground');

            // عرض المحتوى المرتبط
            const targetId = this.getAttribute('data-kt-tab-toggle');
            const targetContent = document.querySelector(targetId);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });

    // معرض الصور - التبديل بين الصور
    const thumbnails = document.querySelectorAll('[data-gallery-thumb]');
    const mainImage = document.querySelector('[data-gallery-main]');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // إزالة الحالة النشطة من جميع الصور المصغرة
            thumbnails.forEach(t => t.classList.remove('ring-2', 'ring-primary'));

            // تفعيل الصورة المحددة
            this.classList.add('ring-2', 'ring-primary');

            // تغيير الصورة الرئيسية
            if (mainImage) {
                const newSrc = this.querySelector('img').src;
                mainImage.src = newSrc;
            }
        });
    });

    // تأكيد الحذف
    const deleteInput = document.getElementById('delete-confirmation');
    const deleteBtn = document.getElementById('delete-confirm-btn');
    const productTitle = document.querySelector('h1').textContent.trim();

    if (deleteInput && deleteBtn) {
        deleteInput.addEventListener('input', function() {
            if (this.value.trim() === productTitle) {
                deleteBtn.disabled = false;
                deleteBtn.classList.remove('opacity-50');
            } else {
                deleteBtn.disabled = true;
                deleteBtn.classList.add('opacity-50');
            }
        });
    }
});

// وظيفة استنساخ المنتج
function cloneProduct(productId) {
    if (confirm('هل تريد استنساخ هذا المنتج؟')) {
        // هنا يمكن إضافة منطق الاستنساخ
        window.location.href = `/products/${productId}/clone`;
    }
}

// وظيفة حذف المنتج
function deleteProduct(productId) {
    // هنا يمكن إضافة منطق الحذف
    console.log('حذف المنتج:', productId);

    // إغلاق المودال
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.classList.add('hidden');
    }

    // إعادة التوجيه
    window.location.href = '/products';
}

// وظيفة تبديل حالة المنتج
function toggleProductStatus(productId, currentStatus) {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';

    // هنا يمكن إضافة منطق تغيير الحالة
    console.log('تغيير حالة المنتج:', productId, 'من', currentStatus, 'إلى', newStatus);

    // إعادة تحميل الصفحة لإظهار التغييرات
    location.reload();
}

// وظيفة عرض Loading Skeleton
function showLoadingSkeleton() {
    document.getElementById('loading-skeleton').classList.remove('hidden');
    document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3').classList.add('hidden');
}

// وظيفة إخفاء Loading Skeleton
function hideLoadingSkeleton() {
    document.getElementById('loading-skeleton').classList.add('hidden');
    document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3').classList.remove('hidden');
}
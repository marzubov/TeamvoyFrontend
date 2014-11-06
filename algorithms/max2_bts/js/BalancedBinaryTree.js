(function (document, window) {
    window.BalancedBinaryTree = function (data, left, right) {
        this.value = data;
        this.left = left;
        this.right = right;

        this.search = function (k) {
            return k == this.value ?
                this : k > this.value ?
                this.right ? this.right.search(k) : null :
                this.left ? this.left.search(k) : null;
        };
    }
})(document, window)
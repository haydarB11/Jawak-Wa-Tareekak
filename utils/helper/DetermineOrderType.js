const { order_status } = require('../../statics/OrderStatic.json');

module.exports = {

    determineOrderType(status) {
        let status;
        if (status == 0) {
            status = order_status.pending;
        } else if (status == 1) {
            status = order_status.accepted;
        } else if (status == 2) {
            status = order_status.rejected;
        } else if (status == 3) {
            status = order_status.canceled;
        }
        
        return status;
    }
    
}

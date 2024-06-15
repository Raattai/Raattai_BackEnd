


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product',  },
  name: { type: String,  },
  quantity: { type: Number,  },
  price: { type: Number,  }
});

const OrderSchema = new Schema({
  order_id: { type: String,},
  tracking_id: { type: String,},
  bank_ref_no: { type: String,},
  order_status: { type: String,},
  failure_message: { type: String, default: '' },
  payment_mode: { type: String, default: 'Credit Card' },
  card_name: { type: String, default: 'Visa' },
  status_code: { type: String, default: 'null' },
  status_message: { type: String,},
  currency: { type: String, default: 'INR' },
  amount: { type: String,},
  billing_name: { type: String, default: 'null' },
  billing_address: { type: String, default: '' },
  billing_city: { type: String, default: '' },
  billing_state: { type: String, default: '' },
  billing_zip: { type: String, default: '' },
  billing_country: { type: String, default: '' },
  billing_tel: { type: String, default: 'null' },
  billing_email: { type: String, default: 'null' },
  delivery_name: { type: String, default: '' },
  delivery_address: { type: String, default: '' },
  delivery_city: { type: String, default: '' },
  delivery_state: { type: String, default: '' },
  delivery_zip: { type: String, default: '' },
  delivery_country: { type: String, default: '' },
  delivery_tel: { type: String, default: '' },
  merchant_param1: { type: String, default: '' },
  merchant_param2: { type: String, default: '' },
  merchant_param3: { type: String, default: '' },
  merchant_param4: { type: String, default: '' },
  merchant_param5: { type: String, default: '' },
  vault: { type: String, default: 'N' },
  offer_type: { type: String, default: 'null' },
  offer_code: { type: String, default: 'null' },
  discount_value: { type: String, default: '0.0' },
  mer_amount: { type: String,},
  eci_value: { type: String, default: 'null' },
  retry: { type: String, default: 'N' },
  response_code: { type: String, default: '' },
  billing_notes: { type: String, default: '' },
  trans_date: { type: String,},
  bin_country: { type: String,},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', OrderSchema);

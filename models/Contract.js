const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Machine = mongoose.model('Machine');

const ContractSchema = new mongoose.Schema({
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: [true, 'Can\'t be blank'],
    set: function(machine) {
      this._previousMachine = this.machine;
      return machine;
    }
  },
  location: {
    type: 'String',
    required: [true, 'Can\'t be blank']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Can\'t be blank']
  },
  status: {
    type: String,
    enum: ['VALID', 'TERMINATED'],
    default: 'VALID'
  },
  location: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date,
    required: [true, 'Can\'t be blank']
  },
  endDate: {
    type: Date,
    required: [true, 'Can\'t be blank']
  },
  saleCommission: {
    type: Number,
    required: [true, 'Can\'t be blank']
  },
  advCommission: {
    type: Number,
    required: [true, 'Can\'t be blank']
  },
  fixedFee: {
    type: Number,
    default: 0
  },
  cashInitial: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    enum: ['EUR'],
    required: [true, 'Can\'t be blank']
  },
  comments: {
    type: String,
    default: ''
  },
  supplyContactName: {
    type: String,
    default: ''
  },
  supplyContactEmail: {
    type: String,
    default: ''
  },
  supplyContactPhone: {
    type: String,
    default: ''
  },
  supplyShippingAddress: {
    type: String,
    default: ''
  },
  items: [{
    price: Number,
    initial_stock: Number,
    mandatory: Boolean,
    item: {
      type: String,
      enum: ['VWPACK', 'VWLAY', 'VWGO', 'VWPLAY'],
      required: [true, 'Can\'t be blank']
    }
  }],
}, { timestamps: true });

ContractSchema.plugin(autoIncrement.plugin, {
  model: 'Contract',
  field: 'number',
  startAt: 1
});

ContractSchema.post('save', function(contract, next) {
  const machineChanged = !this.machine.equals(this._previousMachine);

  Machine.findById(this.machine)
    .then(machine => {
      if (this.status === 'TERMINATED') {
        machine.contract = undefined;
        machine.customer = undefined;
        machine.location = undefined;

        machine.save()
          .then(() => {
            next();
          })
      } else {
        machine.contract = contract._id;
        machine.customer = contract.customer;
        machine.location = contract.location;

        machine.save()
          .then(() => {
            // de-assign old machine
            if (machineChanged && this._previousMachine) {
              Machine.findById(this._previousMachine)
                .then(machine => {
                  machine.contract = undefined;
                  machine.customer = undefined;
                  machine.location = undefined;

                  machine.save()
                    .then(() => {
                      next();
                    })
                })
            } else {
              next();
            }
          })
      }
    })
});

ContractSchema.methods.toAuthJSON = function(cb) {
  return new Promise((resolve, reject) => {
    this
      .populate({
        path: 'customer',
        select: 'number email fullname sector',
        populate: {
          path: 'sector'
        }
      })
      .populate('machine', 'serial', (err, contract) => {
        if (err) { reject(err); }

        resolve(contract);
      })
  })
}

mongoose.model('Contract', ContractSchema);


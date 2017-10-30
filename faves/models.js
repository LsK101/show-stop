const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const FaveSchema = mongoose.Schema({
	userID: {
		type: String,
		required: true,
		unique: true
	},
	favorites: {
		type: Array
	},
});

FaveSchema.methods.apiRepr = function() {
	return {
		favorites: this.favorites || ''
	};
};

const Fave = mongoose.model('Fave', FaveSchema);

module.exports = {Fave};
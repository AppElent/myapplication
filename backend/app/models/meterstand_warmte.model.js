
module.exports = (sequelize, Sequelize) => {

	const MeterstandWarmte = sequelize.define('meterstanden_warmte', {
	  datetime: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	  },
	  meterstand: {
		type: Sequelize.STRING
	  }
	});
	
	return MeterstandWarmte;
}
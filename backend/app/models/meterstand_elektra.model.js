
module.exports = (sequelize, Sequelize) => {

	const MeterstandElektra = sequelize.define('meterstanden_elektra', {
	  datetime: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	  },
	  verbruik_hoog: {
		type: Sequelize.STRING
	  },verbruik_laag: {
		type: Sequelize.STRING
	  },teruglevering_hoog: {
		type: Sequelize.STRING
	  },teruglevering_laag: {
		type: Sequelize.STRING
	  },
	});
	
	return MeterstandElektra;
}


async function updateOrCreate(model, values){
	var gevondenmeterstand = await db.meterstanden.findOne({ where: {datetime: datum} });
	if(gevondenmeterstand == null){
		gevondenmeterstand = await db.meterstanden.create(values);
		//console.log("Moet toegevoegd worden");
	}else{
		gevondenmeterstand = await gevondenmeterstand.update(values);
		//console.log("Moet geupdate worden");
	}
}

const LivreBlobModel = (sequelize, DataTypes) => {
	return sequelize.define(
	  "LibreBlob",
	  {
		Blob: {
			type: DataTypes.BLOB,
			allowNull:true,
		},
		idBlob: {
		  type: DataTypes.INTEGER,
		  primaryKey: true,
		  autoIncrement: true,
		  allowNull: false,
		}
	  },
	  {
		tableName: "t_livreblob",
		timestamps: false,
	  }
	);
  };
  
  export { LivreBlobModel };
  
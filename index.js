const MySQLEvents = require("@rodrigogs/mysql-events");
const axios = require("axios");

const program = async () => {
  const instance = new MySQLEvents(
    {
      host: "localhost",
      user: "root",
      password: "",
    },
    {
      startAtEnd: true,
    }
  );

  await instance.start();

  instance.addTrigger({
    name: "F1 telemetry",
    expression: "f1_telemetry.tb_reportes_comisarios",
    statement: MySQLEvents.STATEMENTS.INSERT,
    onEvent: (event) => {
      const { after: row } = event.affectedRows[0];
      axios
        .post(
          "https://discord.com/api/webhooks/996178997018906694/eW6G-kDv0fAxaz-Cngx1yH1135VovLS5HTZANm4ciUmh5fZChRULk_YfzsHYz8-m2iLu",
          {
            content:
              `Hay un nuevo reporte con radicado **${row.PK_ID_REPORTE}**\n` +
              `Denunciante: ${row.NOMBREDENUNCIANTE} <@${row.ID_DISCORD_DENUNCIANTE}>\n` +
              `Denunciado: ${row.NOMBREDENUNCIADO} <@${row.ID_DISCORD_DENUNCIADO}>\n` +
              "\n" +
              `Toda la información del reporte en https://informes.nitrosimracingclub.com/views/formularioapelacion.php?idreporte=${row.PK_ID_REPORTE}&idcalendario=${row.FK_ID_EVENTO}`,
          }
        )
        .then((response) => {})
        .catch(console.error);
    },
  });

  instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
};

program()
  .then(() => console.log("Waiting for database vents..."))
  .catch(console.error);

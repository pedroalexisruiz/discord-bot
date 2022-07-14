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
      // Aquí debe ir la url del Webhook por el que discord escuchará los mensajes
      axios
        .post(
          "https://discord.com/api/webhooks/996572918601502812/hf6-ibXAtIfCOWqH_V2y7azG_o2YU1HwvbDovfM7u2rBANTabgkK4p_M8c0g9NMtHBa6",
          {
            content:
              `Hay un nuevo reporte con radicado **${row.PK_ID_REPORTE}**\n` +
              `Denunciante: ${row.NOMBREDENUNCIANTE} <@${row.ID_DISCORD_DENUNCIANTE}>\n` +
              `Denunciado: ${row.NOMBREDENUNCIADO} <@${row.ID_DISCORD_DENUNCIADO}>\n` +
              "\n" +
              `Toda la información del reporte en https://informes.nitrosimracingclub.com/views/formularioapelacion.php?idreporte=${row.PK_ID_REPORTE}&idcalendario=${row.FK_ID_EVENTO}\n` +
              "------------------------------------------------------------------------------",
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

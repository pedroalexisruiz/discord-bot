const MySQLEvents = require("@rodrigogs/mysql-events");
const axios = require("axios");

const program = async () => {
  const instance = new MySQLEvents(
    {
      host: "186.31.136.130",
      user: "ndconsulta",
      password: "Nitro2021",
    },
    {
      startAtEnd: true,
      excludeSchema: {
        db1utbf9tkqcmn: true,
        db3dr8rcmpglke: true,
        dbklzt30j7zxd1: true,
        dbrtxbakzm6zu5: true,
        db_roundcube: true,
        f1_play: true,
        f1_steam: true,
        f1_xbox: true,
        information_schema: true,
        mysql: true,
        opendmarc: true,
        performance_schema: true,
        phpmyadmin: true,
        postfixadmin: true,
        sys: true,
        test: true,
        test2: true,
        testtelemetry: true,
        zaveltie_compranet: true,
      },
    }
  );

  await instance.start();

  instance.addTrigger({
    name: "F1 telemetry",
    expression: "dbagc0jv3og4tp.tb_reportes_comisarios",
    statement: MySQLEvents.STATEMENTS.INSERT,
    onEvent: (event) => {
      const { after: row } = event.affectedRows[0];
      // Aquí debe ir la url del Webhook por el que discord escuchará los mensajes
      axios
        .post(
          "https://discord.com/api/webhooks/996178997018906694/eW6G-kDv0fAxaz-Cngx1yH1135VovLS5HTZANm4ciUmh5fZChRULk_YfzsHYz8-m2iLu",
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

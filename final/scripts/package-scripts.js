//https://github.com/sezna/nps
//run 'npx update_scripts' to export to scripts sections of package.json

//You need to setup the react native environnement to run these scripts
//https://reactnative.dev/docs/environment-setup

//Sugar functions
const util = require("nps-utils");
const _ = (script, description) => ({script, description});
const seq = (...args) => util.series(...args);
const par = (...args) => util.concurrent(...args);

const devLocalEnv = '. config/dev.local.env';

const EXPRESS_PORT = 8080;
const MONGO_PORT = 27017;

const mongodb = (() => {
    const cd = "cd server";
    const s = {
        start_no_restore: seq(cd, "kill-port " + MONGO_PORT, "mongod --dbpath=database_live"),
        restore_default: _(seq(
                cd, "mongo --eval \"db = db.getSiblingDB('family-stories'); db.dropDatabase();\"",
                "mongorestore database_default --drop"),
            "restore database to default values"),
        export_default_db: _(seq(cd, "mongodump -o database_default"), "Set database as default"),
        open_compass: _(seq("MongoDBCompass"), "open a db explorer (MongoDBCompass)"),
        start_ci: seq(cd, "mongod --dbpath=database_live --quiet || echo 'mongodb stopped'"),
        install: seq("sudo apt update", "sudo apt-get -y install mongodb"),
    }
    s.start = _(par({
            mangodb: s.start_no_restore,
            restore: seq("sleep 10s",s.restore_default.script)
        }), "start mongodb on port 27017 with default database"
    );

    return s;
})()
const express = (() => {
    const cd = "cd server";
    const s = {
        //nyc => https://github.com/cypress-io/code-coverage
        start: seq(cd, "kill-port " + EXPRESS_PORT, "nodemon --watch src --exec nyc --silent babel-node src/server.js"),
        start_ci: seq(cd, "npx cross-env CI=true nyc --silent babel-node src/server.js  || echo 'express server stopped"),
        stop: seq("killall nodemon | echo"),
        install: seq(cd, "yarn install", "cd .."),
    };
    s.build = seq(cd, "npx babel src --out-dir build", "cd ..");
    return s;
})();


const angular = (() => {
    let cd = 'cd angular';
    const s = {
        install: seq(cd, 'yarn install', "cd .."),
        start: seq(cd,
            "ng serve"
        ),
        build: seq(devLocalEnv, cd, 'ng build'),
        startBuild: seq(devLocalEnv, cd, 'npx http-server -p 8080 -c-1 dist/'),
        installCodeCoverage: _(seq(
            cd,
            "ng add @briebug/cypress-schematic",
            "yarn add --dev istanbul-instrumenter-loader istanbul-lib-coverage @istanbuljs/nyc-config-typescript " +
            "source-map-support ts-node ",
        "cd .."
        ))
        //ng run cypress-demo:e2e-ci && npx nyc report --reporter=lcov --reporter=text-summary
    };

    return s;
})();

const cypress = (() => {
    let cd = 'cd angular';
    const s = {
        start: _(seq("export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2; exit;}'):0.0",
            "echo $DISPLAY",
            cd,
            "npx cypress open",
        ), "open Cypress UI and run end to end tests"),
        // https://dev.to/cssoldiervoif/code-coverage-with-cypress-angular-45pb
        install_code_coverage:seq(
            "yarn add -D @briebug/cypress-schematic ngx-build-plus istanbul-instrumenter-loader " +
            "@istanbuljs/nyc-config-typescript source-map-support ts-node @cypress/code-coverage nyc " +
            "istanbul-lib-coverage @cypress/webpack-preprocessor",
            "ng add @briebug/cypress-schematic",
        ),
        install_wsl2_lib: _(seq(
            "sudo apt update",
            "sudo apt -y install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb",
        ), "open Cypress UI and run end to end tests"),
        install_xserver: _(seq(
            //https://nickymeuleman.netlify.app/blog/gui-on-wsl2-cypress
            "echo '\nexport DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2; exit;}'):0.0' >> ~/bashrc\\n",
            "echo '\nsudo /etc/init.d/dbus start &> /dev/null' >> ~/bashrc.sh\n",
            "cp /etc/sudoers.d/dbus /etc/sudoers.d/dbus.tmp",
            "echo $(whoami) >> /etc/sudoers.d/dbus.tmp\n",
            "cp /etc/sudoers.d/dbus.tmp /etc/sudoers.d/dbus",
            //vcxsrv must be installed on the windows side: https://sourceforge.net/projects/vcxsrv/
            "echo 'vcxsrv must be installed on the windows side, download https://sourceforge.net/projects/vcxsrv/'",
        ), "set DISPLAY variable to the IP automatically assigned to WSL2"),
    }
    return s;
})()

const workflow = (() => {
    const s = {
        start_to_dev: _(par({
            angular: angular.start,
            express: express.start,
            mongodb: mongodb.start.script,
            cypress: cypress.start.script,
        }), "Start angular, mongodb, express server and open cypress"),
        install: _(par({
            angular: angular.install,
            express: express.install,
            mongodb: mongodb.install,
            xserv_lib: cypress.install_wsl2_lib,
        }), "Install angular, mongodb, express server and xserver wsl2 libs"),
    }
    return s;
})();

const packageScripts = {
    scripts: {
        workflow,
        killall: "killall node",
        cypress,
        angular,
        express,
        mongodb,
    },
};

console.warn(
    "To see all available commands run 'nps'. You may have a look at scripts/package-scripts.js for further documentations.");
module.exports = packageScripts;

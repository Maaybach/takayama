
/* ==========================================
   TAKAYAMA — GENERATEUR DE PACKS FIVEM
   Version reconstruite
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const main = document.querySelector("main") || document.body;

    // Évite de créer plusieurs configurateurs
    let configurator = document.getElementById("configurator");

    if (!configurator) {
        configurator = document.createElement("section");
        configurator.id = "configurator";
        configurator.style.cssText = `
            max-width: 900px;
            margin: 50px auto;
            padding: 30px;
            color: #fff;
            background: rgba(25, 18, 29, 0.96);
            border: 1px solid rgba(255, 160, 190, 0.4);
            border-radius: 18px;
            box-sizing: border-box;
        `;

        configurator.innerHTML = `
            <h2 style="text-align:center;color:#ff9fbd">
                TAKAYAMA — Créateur de pack
            </h2>

            <p style="text-align:center;color:#ddd">
                Personnalise ton pack graphique FiveM.
            </p>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px">

                <label>
                    Durée du pack
                    <select id="pack-type">
                        <option value="onetime">One Time — journée</option>
                        <option value="alltime">All Time — toutes les heures</option>
                    </select>
                </label>

                <label>
                    Couleur du ciel
                    <select id="sky-color">
                        <option value="natural">Naturel</option>
                        <option value="blue">Bleu intense</option>
                        <option value="orange">Orange</option>
                        <option value="pink">Rose</option>
                        <option value="purple">Violet</option>
                        <option value="red">Rouge</option>
                    </select>
                </label>

                <label>
                    Style des nuages
                    <select id="cloud-style">
                        <option value="realistic">Réalistes</option>
                        <option value="soft">Doux</option>
                        <option value="dramatic">Dramatiques</option>
                        <option value="clear">Ciel dégagé</option>
                    </select>
                </label>

                <label>
                    Couleur des nuages
                    <select id="cloud-color">
                        <option value="natural">Naturelle</option>
                        <option value="white">Blanche</option>
                        <option value="blue">Bleue</option>
                        <option value="pink">Rose</option>
                        <option value="orange">Orange</option>
                        <option value="purple">Violette</option>
                    </select>
                </label>

                <label>
                    Étoiles
                    <select id="stars">
                        <option value="natural">Naturelles</option>
                        <option value="bright">Plus lumineuses</option>
                        <option value="none">Désactivées</option>
                    </select>
                </label>

                <label>
                    Étoiles filantes
                    <select id="shooting-stars">
                        <option value="off">Désactivées</option>
                        <option value="on">Activées</option>
                    </select>
                </label>

                <label>
                    Traînées de balles
                    <select id="contrails">
                        <option value="original">Originales</option>
                        <option value="off">Désactivées</option>
                    </select>
                </label>

            </div>

            <div style="margin-top:25px">
                <label for="source-pack">
                    <strong>1. Sélectionne le dossier de ton pack source</strong>
                </label>
                <input
                    id="source-pack"
                    type="file"
                    webkitdirectory
                    directory
                    multiple
                    style="display:block;width:100%;margin-top:12px"
                >
                <p id="file-count" style="color:#ffb6cc">
                    Aucun fichier sélectionné.
                </p>
            </div>

            <button
                id="generate-button"
                type="button"
                style="
                    display:block;
                    width:100%;
                    margin-top:25px;
                    padding:16px;
                    border:0;
                    border-radius:10px;
                    background:#f28bab;
                    color:#24121b;
                    font-weight:bold;
                    font-size:16px;
                    cursor:pointer;
                "
            >
                GÉNÉRER MON PACK ZIP
            </button>

            <p
                id="generation-message"
                role="status"
                aria-live="polite"
                style="margin-top:18px;text-align:center;overflow-wrap:anywhere"
            ></p>

            <p style="font-size:12px;color:#bbb;text-align:center">
                Version expérimentale : seules les modifications du ciel
                prises en charge par le fichier source sont appliquées.
                Les autres choix sont enregistrés dans la configuration.
            </p>
        `;

        main.appendChild(configurator);
    }

    const get = (id) => document.getElementById(id);

    const sourceInput = get("source-pack");
    const fileCount = get("file-count");
    const message = get("generation-message");
    const generateButton = get("generate-button");

    if (
        !sourceInput ||
        !fileCount ||
        !message ||
        !generateButton
    ) {
        console.error("TAKAYAMA : éléments du configurateur introuvables.");
        return;
    }

    // Affiche le nombre de fichiers sélectionnés
    sourceInput.addEventListener("change", () => {
        const files = Array.from(sourceInput.files || []);

        fileCount.textContent = files.length
            ? `${files.length} fichier(s) sélectionné(s).`
            : "Aucun fichier sélectionné.";

        message.textContent = "";
    });

    // Personnalisation expérimentale des couleurs du ciel
    function customizeSky(xml, skyColor) {
        const colors = {
            blue:   [0.20, 0.48, 1.00],
            orange: [1.00, 0.48, 0.16],
            pink:   [1.00, 0.38, 0.68],
            purple: [0.62, 0.34, 1.00],
            red:    [1.00, 0.16, 0.16]
        };

        const target = colors[skyColor];

        if (!target) {
            return { xml, changed: 0 };
        }

        const reference = [0.1765, 0.3961, 0.7294];

        const tags = [
            "sky_zenith_col",
            "sky_zenith_transition_col",
            "sky_azimuth_east_col",
            "sky_azimuth_west_col",
            "sky_azimuth_transition_col"
        ];

        let changed = 0;

        for (const tag of tags) {
            for (let channel = 0; channel < 3; channel++) {
                const suffix = ["r", "g", "b"][channel];
                const name = `${tag}_${suffix}`;

                const expression = new RegExp(
                    `(<${name}>\\s*)([^<]*?)(\\s*</${name}>)`,
                    "gi"
                );

                const ratio = target[channel] / reference[channel];

                xml = xml.replace(
                    expression,
                    (whole, start, values, end) => {
                        const numbers = values.trim()
                            .split(/\s+/)
                            .map(Number);

                        if (
                            !numbers.length ||
                            numbers.some(n => !Number.isFinite(n))
                        ) {
                            return whole;
                        }

                        const updated = numbers.map(value =>
                            Math.max(0, Math.min(1, value * ratio))
                        );

                        changed++;

                        return start +
                            updated.map(n => n.toFixed(4)).join(" ") +
                            end;
                    }
                );
            }
        }

        return { xml, changed };
    }

    // Génération du ZIP
    generateButton.addEventListener("click", async () => {
        if (typeof JSZip === "undefined") {
            message.textContent =
                "Erreur : JSZip n'est pas chargé. Vérifie ta connexion Internet et le script JSZip dans index.html.";
            return;
        }

        const files = Array.from(sourceInput.files || []);

        if (!files.length) {
            message.textContent =
                "Sélectionne d'abord le dossier complet de ton pack source.";
            return;
        }

        generateButton.disabled = true;
        generateButton.style.opacity = "0.6";
        message.textContent = "Préparation du pack en cours…";

        try {
            const zip = new JSZip();

            const choices = {
                packType: get("pack-type").value,
                skyColor: get("sky-color").value,
                cloudStyle: get("cloud-style").value,
                cloudColor: get("cloud-color").value,
                stars: get("stars").value,
                shootingStars: get("shooting-stars").value,
                contrails: get("contrails").value
            };

            let addedFiles = 0;
            let skyFileFound = false;
            let skyParametersChanged = 0;

            // Repère le dossier racine pour conserver l'arborescence
            // interne du pack sans ajouter le dossier sélectionné lui-même.
            const firstPath = files[0].webkitRelativePath || files[0].name;
            const rootFolder = firstPath.includes("/")
                ? firstPath.split("/")[0] + "/"
                : "";

            for (const file of files) {
                let zipPath = file.webkitRelativePath || file.name;

                if (rootFolder && zipPath.startsWith(rootFolder)) {
                    zipPath = zipPath.slice(rootFolder.length);
                }

                if (!zipPath) {
                    continue;
                }

                let content = file;

                // Détection plus souple : accepte @4n0m4lly,
                // @4n0m4lly.xml et les extensions éventuelles.
                const filename = file.name.toLowerCase();

                if (
                    filename.startsWith("@4n0m4lly") &&
                    choices.skyColor !== "natural"
                ) {
                    skyFileFound = true;

                    const originalText = await file.text();
                    const result = customizeSky(
                        originalText,
                        choices.skyColor
                    );

                    content = result.xml;
                    skyParametersChanged += result.changed;
                }

                zip.file(zipPath, content);
                addedFiles++;
            }

            const configuration = {
                generator: "TAKAYAMA",
                version: 1,
                generatedAt: new Date().toISOString(),
                options: choices,
                skyCustomization: {
                    fileDetected: skyFileFound,
                    fieldsChanged: skyParametersChanged,
                    experimental: true
                },
                note:
                    "Les options autres que la couleur du ciel sont enregistrées, mais ne sont pas encore toutes appliquées aux fichiers graphiques."
            };

            zip.file(
                "takayama-config.json",
                JSON.stringify(configuration, null, 2)
            );

            message.textContent = "Création du ZIP…";

            const blob = await zip.generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: { level: 5 }
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download =
                `TAKAYAMA-Gunfight-${choices.packType}.zip`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(() => URL.revokeObjectURL(url), 2000);

            let resultMessage =
                `ZIP créé (${addedFiles} fichiers source + configuration).`;

            if (choices.skyColor === "natural") {
                resultMessage +=
                    " Couleur naturelle sélectionnée : le ciel original a été conservé.";
            } else if (!skyFileFound) {
                resultMessage +=
                    " Fichier @4n0m4lly introuvable : le ciel n'a pas été modifié.";
            } else if (skyParametersChanged === 0) {
                resultMessage +=
                    " Fichier détecté, mais aucun paramètre de couleur reconnu n'a été modifié.";
            } else {
                resultMessage +=
                    ` Fichier du ciel détecté : ${skyParametersChanged} champs de couleur traités. Vérifie le résultat en jeu.`;
            }

            message.textContent = resultMessage;

        } catch (error) {
            console.error("TAKAYAMA — erreur de génération :", error);

            message.textContent =
                "Erreur pendant la génération du ZIP. Ouvre la console du navigateur avec F12 pour voir le détail.";
        } finally {
            generateButton.disabled = false;
            generateButton.style.opacity = "1";
        }
    });

    // Si le site possède déjà un bouton de lancement,
    // il permet d'accéder au configurateur sans supprimer le reste.
    const startButton = get("start-button");

    if (startButton) {
        startButton.addEventListener("click", () => {
            configurator.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }
});

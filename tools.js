async function loadMCParticles(infoBoxes, parentLinks, childrenLinks) {
  const eventNum = 3;
  const response = await fetch("./p8_ee_ZH_ecm240_edm4hep.edm4hep.json");
  const jsonData = await response.json();
  const eventData = jsonData["Event " + eventNum];
  // console.log(eventData);
  const mcParticles = Object.values(eventData).find(element => element.collType == "edm4hep::MCParticleCollection");

  for (i in mcParticles.collection) {
    const particle = mcParticles.collection[i];
    const box = new InfoBox(i);
    box.pdg = particle.PDG;
    box.genStatus = particle.generatorStatus;
    box.momentum = Math.sqrt(Math.pow(particle.momentum.x, 2),
                             Math.pow(particle.momentum.y, 2),
                             Math.pow(particle.momentum.z, 2));
    box.name = getName(particle.PDG);

    if (particle.parents.length === 0 && particle.daughters.length === 0) {
      box.row = -1;
      console.log("WARNING: Standalone particle!");
    }

    if (particle.parents.length === 0) {
      box.row = 0;
    }

    for (j in particle.parents) {
      const parentId = particle.parents[j].index;
      box.parents.push(parentId);
      box.row = infoBoxes[parentId].row + 1;
      link = new Link(parseInt(parentLinks.length), parentId, i);
      link.color = "#A00";  // Darkish red
      parentLinks.push(link);
      box.parentLinks.push(link.id);
    }

    for (j in particle.daughters) {
      childrenId = particle.daughters[j].index;
      box.children.push(childrenId);
      link = new Link(parseInt(childrenLinks.length), i, childrenId);
      link.color = "#0A0";  // Darkish green
      childrenLinks.push(link);
      box.childrenLinks.push(link.id);
    }

    infoBoxes.push(box);
  }
}

function drawLine(ctx, startX, startY, endX, endY, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.restore();
}

function drawCross(ctx, x, y, color = "#F00") {
  const crossLenght = 6;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - crossLenght, y - crossLenght);
  ctx.lineTo(x + crossLenght, y + crossLenght);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + crossLenght, y - crossLenght);
  ctx.lineTo(x - crossLenght, y + crossLenght);
  ctx.stroke();
  ctx.restore();
}

function drawRoundedRect(ctx, x, y, width, height, fillColor) {
  ctx.save();

  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 15);
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 15);
  ctx.stroke();
  ctx.restore();
}

function drawTex(ctx, x, y, texImg) {
  const tempWidth = texImg.naturalWidth * 2;
  const tempHeight = texImg.naturalHeight * 2;

  ctx.save();
  ctx.drawImage(texImg,
                x - tempWidth / 2, y - tempHeight / 2,
                tempWidth, tempHeight);
  ctx.restore();
}

function getName(pdg) {
  switch (pdg) {
    case 1:
      return "d";
    case -1:
      return "{\\bar d}";
    case 2:
      return "u";
    case -2:
      return "{\\bar u}";
    case 3:
      return "s";
    case -3:
      return "{\\bar s}";
    case 4:
      return "c";
    case -4:
      return "{\\bar c}";
    case 5:
      return "b";
    case -5:
      return "{\\bar b}";
    case 11:
      return "e^{-}";
    case -11:
      return "e^{+}";
    case 12:
      return "\\nu_{e}";
    case -12:
      return "{\\bar \\nu}_{e}";
    case 13:
      return "\\mu^{-}";
    case -13:
      return "\\mu^{+}";
    case 14:
      return "\\nu_{\\mu}";
    case -14:
      return "{\\bar \\nu}_{\\mu}";
    case 15:
      return "\\tau^{-}";
    case -15:
      return "\\tau^{+}";
    case 16:
      return "\\nu_{\\tau}";
    case -16:
      return "{\\bar \\nu}_{\\tau}";
    case 21:
      return "g";
    case 22:
      return "\\gamma";
    case 23:
      return "Z";
    case 25:
      return "H";
    case 111:
      return "\\pi^{0}";
    case 113:
      return "\\rho^{0}(770)";
    case 211:
      return "\\pi^{+}";
    case 213:
      return "\\rho(770)^{+}";
    case -213:
      return "\\rho(770)^{-}";
    case -211:
      return "\\pi^{-}";
    case 221:
      return "\\eta";
    case 223:
      return "\\omega(782)";
    case 313:
      return "K^{*}(892)^{0}";
    case 310:
      return "K^{0}_{S}";
    case 311:
      return "K^{0}";
    case -311:
      return "{\\bar K}^{0}";
    case -313:
      return "{\\bar K}^{*}(892)^{0}";
    case 321:
      return "K^{+}";
    case -321:
      return "K^{-}";
    case 323:
      return "K^{*}(892)^{+}";
    case -323:
      return "K^{*}(892)^{-}";
    case 411:
      return "D^{+}";
    case -411:
      return "d^{-}";
    case 415:
      return "D^{*}_{2}(2460)^{+}";
    case 421:
      return "D^{0}";
    case -421:
      return "{\\bar D}^{0}";
    case 423:
      return "D^{*}(2007)^{0}";
    case -423:
      return "{\\bar D}^{*}(2007)^{0}";
    case 511:
      return "B^{0}";
    case -511:
      return "{\\bar B}^{0}";
    case 513:
      return "B^{*0}";
    case -513:
      return "{\\bar B}^{*0}";
    case 521:
      return "B^{+}";
    case -521:
      return "B^{-}";
    case 523:
      return "B^{*+}";
    case -523:
      return "B^{*-}";
    case 2112:
      return "n";
    case -2112:
      return "{\\bar n}";
    case 2212:
      return "p";
    case -2212:
      return "{\\bar p}";
    case 2224:
      return "\\Delta^{++}";
    case -2224:
      return "\\Delta^{--}";
    case 3122:
      return "\\Lambda";
    case -3122:
      return "{\\bar \\Lambda}";
    case 3212:
      return "\\Sigma^{0}";
    case -3212:
      return "{\\bar \\Sigma}^{0}";
    case 3222:
      return "\\Sigma^{+}";
    case -3222:
      return "\\Sigma^{-}";
    case 4122:
      return "\\Lambda^{+}_{c}";
    case -4122:
      return "\\Lambda^{-}_{c}";
    case 4212:
      return "\\Sigma^{+}_{c}";
    case -4212:
      return "\\Sigma^{-}_{c}";
    case 4222:
      return "\\Sigma^{++}";
    case -4222:
      return "\\Sigma^{--}";
    default:
      console.log("PDG: " + particle.PDG.toString());
      return "PDG: " + particle.PDG.toString();
  }
}

import {
  ParentLink,
  DaughterLink,
  MCRecoParticleAssociation,
  MCRecoClusterParticleAssociation,
  MCRecoTrackParticleAssociation,
  Clusters,
  Tracks,
  Particles,
  Vertex,
  ParticleIDLink,
} from "../objects/Link.js";

export { Link } from "../objects/Link.js";

export const linkTypes = {
  "parents": ParentLink,
  "daughters": DaughterLink,
  "edm4hep::MCRecoParticleAssociation": MCRecoParticleAssociation,
  "podio::LinkCollection<edm4hep::ReconstructedParticle,edm4hep::MCParticle>": MCRecoParticleAssociation,
  "edm4hep::MCRecoClusterParticleAssociation": MCRecoClusterParticleAssociation,
  "edm4hep::MCRecoTrackParticleAssociation": MCRecoTrackParticleAssociation,
  "clusters": Clusters,
  "tracks": Tracks,
  "particles": Particles,
  "particle": Particles,
  "startVertex": Vertex,
  "decayVertex": Vertex,
  "associatedParticle": Vertex,
  "particleIDs": ParticleIDLink,
};

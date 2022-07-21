import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SerialisationTest } from "../target/types/serialisation_test";

import { PublicKey, Keypair } from "@solana/web3.js"


interface Reactie {
  discord: string,
  twitter: string,
  cv_url:  string,
  github:  string,
  idVanVacature: number,
  eigenaar: PublicKey,
  reactieID: number
}

function deriveerReactieKeypair(vacatureID: number, reactieID: number) {
  let idArr = new Uint8Array(8)
  idArr.set([vacatureID]);

  let seed_array = Array.from(anchor.utils.bytes.utf8.encode("ReactieVacature_"))
    .concat(Array.from(idArr))
    .concat([reactieID >> 8, reactieID & 0xff]) // manuele serialisatie, little endian

  seed_array.push(...new Array(6).fill(0xff));
  console.log(seed_array, seed_array.length)

  return Keypair.fromSeed(Uint8Array.from(seed_array));
}


describe("serialisation-test", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const wallet = anchor.Wallet.local();
  const program = anchor.workspace.SerialisationTest as Program<SerialisationTest>;

  it("Is initialized!", async () => {
    let r: Reactie = {
      discord: "simeondermaats#1234",
      twitter: "simeondermaats",
      cv_url:  "https://www.bestaat_niet.nl",
      github:  "WalrusGumboot",
      idVanVacature: 0,
      eigenaar: program.programId,
      reactieID: 1
    }

    let reactiePaar = deriveerReactieKeypair(0, 1);

    const tx = await program.rpc.maakReactie(r, {
      accounts: {
        reactieAccount: reactiePaar.publicKey,
        maker: r.eigenaar,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [wallet.payer]
    })

    console.log("Succesfully sent transaction ", tx)
  });
});

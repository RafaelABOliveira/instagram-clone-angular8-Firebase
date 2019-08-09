import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import { Progresso } from "./progresso.service";

@Injectable()
export class Bd {
  constructor(private progresso: Progresso) {}

  public publicar(publicacao: any): void {
    console.log(publicacao);

    let nomeImagem = Date.now();

    firebase
      .database()
      .ref(`publicacoes/${btoa(publicacao.email)}`)
      .push({ titulo: publicacao.titulo, url_imagem: nomeImagem })
      .then((resposta: any) => {
        let nomeImagem = resposta.key;

        firebase
          .storage()
          .ref()
          .child(`imagens/${nomeImagem}`)
          .put(publicacao.imagem)
          .on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            //acompanhamento upload
            (snapshot: any) => {
              this.progresso.status = "andamento";
              this.progresso.estado = snapshot;
            },
            error => {
              this.progresso.status = "erro";
              //console.log(error)
            },
            () => {
              this.progresso.status = "concluido";
              //finalização do processo

              //console.log('upload completo')
            }
          );
      });
  }

  //consultar imagens no database
  public consultaPublicacoes(emailUsario: string): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(`publicacoes/${btoa(emailUsario)}`)
        .orderByKey()
        .once("value")
        .then((snapshot: any) => {
          //console.log(snapshot.val());

          let publicacoes: Array<any> = [];

          snapshot.forEach((childSnapshot: any) => {
            let publicacao = childSnapshot.val();
            publicacao.key = childSnapshot.key;

            publicacoes.push(publicacao);
          });

          //console.log(publicacoes)
          //resolve(publicacoes)
          return publicacoes.reverse();
        })
        .then((publicacoes: any) => {
          publicacoes.forEach(publicacao => {
            //consultar url da imagem (storage)
            firebase
              .storage()
              .ref()
              .child(`imagens/${publicacao.key}`)
              .getDownloadURL()
              .then((url: string) => {
                publicacao.url_imagem = url;

                //consultar nome do usuário
                firebase
                  .database()
                  .ref(`usuario_detalhe/${btoa(emailUsario)}`)
                  .once("value")
                  .then((snapshot: any) => {
                    publicacao.nome_usuario = snapshot.val().nome_usuario;
                  });
              });
          });

          resolve(publicacoes);
        });
    });
  }
}

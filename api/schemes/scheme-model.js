const db = require("../../data/db-config");

function find() { // Egzersiz A
  /*
    1A- Aşağıdaki SQL sorgusunu SQLite Studio'da "data/schemes.db3" ile karşılaştırarak inceleyin.
    LEFT joini Inner joine çevirirsek ne olur?

      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;

    2A- Sorguyu kavradığınızda devam edin ve onu Knex'te oluşturun.
    Bu işlevden elde edilen veri kümesini döndürün.
  */

    return db("schemes")
      .leftJoin("steps", "steps.scheme_id", "schemes.scheme_id")
      .select("schemes.*")
      .count("steps.step_id as number_of_steps")
      .groupBy("schemes.scheme_id")
      .orderBy("schemes.scheme_id","asc");

}

async function findById(scheme_id) { // Egzersiz B
  /*
    1B- Aşağıdaki SQL sorgusunu SQLite Studio'da "data/schemes.db3" ile karşılaştırarak inceleyin:

      SELECT
          sc.scheme_name,
          st.*
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      WHERE sc.scheme_id = 1
      ORDER BY st.step_number ASC;

    2B- Sorguyu kavradığınızda devam edin ve onu Knex'te oluşturun
    parametrik yapma: `1` hazır değeri yerine `scheme_id` kullanmalısınız.

    3B- Postman'da test edin ve ortaya çıkan verilerin bir şema gibi görünmediğini görün,
    ancak daha çok her biri şema bilgisi içeren bir step dizisi gibidir:

      [
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 2,
          "step_number": 1,
          "instructions": "solve prime number theory"
        },
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 1,
          "step_number": 2,
          "instructions": "crack cyber security"
        },
        // etc
      ]

    4B- Elde edilen diziyi ve vanilya JavaScript'i kullanarak, ile bir nesne oluşturun.
   Belirli bir "scheme_id" için adımların mevcut olduğu durum için aşağıdaki yapı:

      {
        "scheme_id": 1,
        "scheme_name": "World Domination",
        "steps": [
          {
            "step_id": 2,
            "step_number": 1,
            "instructions": "solve prime number theory"
          },
          {
            "step_id": 1,
            "step_number": 2,
            "instructions": "crack cyber security"
          },
          // etc
        ]
      }

    5B- Bir "scheme_id" için adım yoksa, sonuç şöyle görünmelidir:

      {
        "scheme_id": 7,
        "scheme_name": "Have Fun!",
        "steps": []
      }
  */

      const schemeWithSteps = await db("schemes")
                                    .leftJoin("steps", "steps.scheme_id", "schemes.scheme_id")
                                    .select("schemes.scheme_name","steps.*")
                                    .where("schemes.scheme_id", scheme_id)
                                    .orderBy("steps.step_number", "asc");

      const responseData = {
        scheme_id: parseInt(scheme_id),
        scheme_name: schemeWithSteps[0].scheme_name,
        steps: []
      };

      if(schemeWithSteps[0].step_number === null) {
        return responseData
      } else {
        schemeWithSteps.forEach(item => {
          responseData.steps.push({
              "step_id": item.step_id,
              "step_number": item.step_number,
              "instructions": item.instructions
          });
        });
        return responseData;
      }




}

async function findSteps(scheme_id) { // Egzersiz C
  /*
    1C- Knex'te aşağıdaki verileri döndüren bir sorgu oluşturun.
    Adımlar, adım_numarası'na göre sıralanmalıdır ve dizi
    Şema için herhangi bir adım yoksa boş olmalıdır:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
      const steps = await db("schemes")
                                    .leftJoin("steps", "steps.scheme_id", "schemes.scheme_id")
                                    .select("steps.*", "schemes.scheme_name")
                                    .where("schemes.scheme_id",scheme_id)
                                    .orderBy("steps.step_number", "asc");

      return !steps[0].step_id ? [] : steps;


}

async function add(scheme) { // Egzersiz D
  /*
    1D- Bu işlev yeni bir şema oluşturur ve _yeni oluşturulan şemaya çözümlenir.
  */

    const insertedSchemeId = await db("schemes").insert(scheme);

    return await findById(insertedSchemeId);
}

async function addStep(scheme_id, step) { // EXERCISE E
  /*
    1E- Bu işlev, verilen 'scheme_id' ile şemaya bir adım ekler.
    ve verilen "scheme_id"ye ait _tüm adımları_ çözer,
    yeni oluşturulan dahil.
  */
    await db("steps").insert({...step,scheme_id});
    return await findSteps(scheme_id);

}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}

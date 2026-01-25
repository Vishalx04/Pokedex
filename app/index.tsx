import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

interface Pokemon {
  name :string
  url : string
}
export default function Index() {

  useEffect(() => {
    fetchPokemon();
  }, [])

  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  async function fetchPokemon() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=20");
      const data = await response.json();
      setPokemons(data.results);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ScrollView>
       {
        pokemons.map((pokemon)=>{
          return (
             <View key={pokemon.name}>
            <Text>
              {pokemon.name}
            </Text>
           </View>
          )
        })
       }


      </ScrollView>
  );
}

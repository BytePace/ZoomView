import React from 'react';
import {Image, StyleSheet, Text, View,} from 'react-native';
import ZoomView from 'react-native-border-zoom-view';

class Sample extends React.Component {
    renderTwoRows() {
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <Image style={styles.squareImage25}
                           source={{uri: 'https://i.kym-cdn.com/photos/images/newsfeed/001/328/469/2a0.jpg'}}/>
                    <Image style={styles.squareImage25}
                           source={{uri: 'https://i.pinimg.com/originals/bf/59/e2/bf59e2cbe15b06379e29023188d9115e.jpg'}}/>
                    <Image style={styles.squareImage25}
                           source={{uri: 'https://www.pixilart.com/images/art/8a12360014c76e2.png'}}/>
                    <Image style={styles.squareImage25}
                           source={{uri: 'https://ih1.redbubble.net/image.564901676.9479/flat,550x550,075,f.u1.jpg'}}/>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Image style={styles.squareImage25}
                           source={{uri: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/cbd064b4-233a-4a91-9a54-a8a9e0ca43ef/dc753rv-512366d3-56a6-4d9e-b3b8-7e53895c700a.png/v1/fill/w_774,h_1033,strp/cat_no_banana_by_kingpeachhill_dc753rv-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTM2NiIsInBhdGgiOiJcL2ZcL2NiZDA2NGI0LTIzM2EtNGE5MS05YTU0LWE4YTllMGNhNDNlZlwvZGM3NTNydi01MTIzNjZkMy01NmE2LTRkOWUtYjNiOC03ZTUzODk1YzcwMGEucG5nIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.Jh6Zp9jdQ5TVHIV5Q4GbN7rLMApfMxdzHs9Qddo31ug'}}/>
                    <Image style={styles.squareImage25}
                           source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_PZiqJquLhrKXLvP0kiFvhEbisYRHN2M8oTg_EaUEK_jU3n8K'}}/>
                    <Image style={styles.squareImage25}
                           source={{uri: 'https://scontent-lga3-1.cdninstagram.com/vp/1b0133bf299dbe3e6f316342cdb10e78/5D765715/t51.2885-15/e35/49858587_378050329654372_5255809752346296433_n.jpg?_nc_ht=scontent-lga3-1.cdninstagram.com'}}/>
                    <Image style={styles.squareImage25}
                           source={{uri: 'https://res.cloudinary.com/teepublic/image/private/s--5ayHCNFg--/t_Preview/b_rgb:ffffff,c_limit,f_jpg,h_630,q_90,w_630/v1534848278/production/designs/3049384_0.jpg'}}/>
                </View>
            </View>
        )
    }

    render() {
        return (
            <ZoomView style={{height: '100%', width: '100%'}} //default height is '100%', but you can configure it
                      minZoom={1}   //1 is minimum
                      maxZoom={3}
                      zoomLevels={2} //count of double tap zoom levels. 2 is default, 0 disables double tap
            >
                <View style={styles.container}>
                    <Text style={styles.instructions}>Cat no banana gallery zoom example</Text>
                    <Text style={styles.instructions}>Use two fingers or double tap to zoom</Text>
                    <Text style={styles.instructions}>Swipe to move</Text>
                    {this.renderTwoRows()}
                    {this.renderTwoRows()}
                    {this.renderTwoRows()}
                    {this.renderTwoRows()}
                    {this.renderTwoRows()}
                </View>
            </ZoomView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',

    },
    instructions: {
        width: '100%',
        textAlign: 'center',
        fontSize: 16,
        color: '#333333',
        marginBottom: 5,
    },
    squareImage25: {
        width: '25%',
        aspectRatio: 1,
    }
});

export default Sample;
